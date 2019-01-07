package OntologyEngine.Communicator;

import OntologyEngine.OntologyBuilder.Ontology;
import OntologyEngine.OntologyBuilder.OntologyBuilder;
import OntologyEngine.OntologyBuilder.OntologyDecorators.OntologyStrings;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.semanticweb.owlapi.model.OWLClass;
import org.semanticweb.owlapi.model.OWLNamedIndividual;
import org.semanticweb.owlapi.reasoner.OWLReasoner;

import java.util.Iterator;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class MqttSubscribeCallback implements MqttCallback {
	private static final JSONParser jsonParser = new JSONParser();

	@Override
	public void connectionLost(Throwable throwable) {

	}

	@Override
	public void messageArrived(String topic, MqttMessage message) throws Exception {
		if(topic.equals(TopicStrings.ONTOLOGY_CREATE))
				onOntologyCreate(message);
		else if(topic.startsWith(TopicStrings.ONTOLOGY_QUERY_WITHOUT_WILDCARD))
			onOntologyQuery(message, topic.substring(TopicStrings.ONTOLOGY_QUERY_WITHOUT_WILDCARD.length()));
		else
			onDifferentTopic(message);
	}

	private void onOntologyQuery(MqttMessage message, String ontologyName) {
		try {
			JSONObject json = (JSONObject) jsonParser.parse(message.toString());
			JSONObject data = (JSONObject) json.get("data");
			Ontology ontology = OntologyBuilder.getHALOntology(ontologyName);
			OWLNamedIndividual individual = ontology.createNamedIndividual("a",OntologyStrings.DATA);
			Iterator it = data.keySet().iterator();

			while(it.hasNext()){
				String fieldName = (String) it.next();
				Object value = data.get(fieldName);
				fieldName = fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1).toLowerCase();
				if (value instanceof Long){
					ontology.addDataPropertyToIndividual(individual, "has" +fieldName+"Value", ((Long) value).intValue());
				}else if (value instanceof Float){
					ontology.addDataPropertyToIndividual(individual, "has" +fieldName+"Value", (float) value);
				}else if (value instanceof Double){
					ontology.addDataPropertyToIndividual(individual, "has" +fieldName+"Value", (double) value);
				}else if (value instanceof Boolean){
					ontology.addDataPropertyToIndividual(individual, "has" +fieldName+"Value", (boolean) value);
				}else if (value instanceof String){
					ontology.addDataPropertyToIndividual(individual, "has" +fieldName+"Value", (String) value);
				}
				ontology.addObjectPropertyToIndividual(individual, OntologyStrings.HAS_FIELD, fieldName + "Field");
			}
			if(data.containsKey("id")) {
				String id = (String) data.get("id");
				ontology.addObjectPropertyToIndividual(individual, OntologyStrings.HAS_ID_FIELD, id);
			}
			OWLReasoner reasoner = ontology.getReasoner();
			Stream<OWLClass> classes = reasoner.types(individual, false);
			System.out.println(reasoner.types(individual, false).collect(Collectors.toSet()));
			System.out.println(reasoner.getInstances(ontology.getClass(OntologyStrings.TEMPERATURE_DATA)));
			System.out.println(reasoner.unsatisfiableClasses().collect(Collectors.toSet()));
			MqttCommunicator communicator = MqttCommunicator.getInstance();
			classes.forEach((cls) ->{
				try {
					communicator.publish(data.toJSONString(),
							TopicStrings.ONTOLOGY_CLASSIFIED + "/" + ontologyName + '/' + cls.getIRI().getShortForm());
				} catch (MqttException e) {
					e.printStackTrace();
				}

			});
		} catch (ParseException pe) {
			pe.printStackTrace();
		}
	}

	private void onOntologyCreate(MqttMessage message) {
		try {
			JSONObject data = (JSONObject) jsonParser.parse(message.toString());
			System.out.println(data.toJSONString());
			String id = (String) data.get("id");
			OntologyBuilder.saveOntology(id);

		} catch (ParseException pe) {
			pe.printStackTrace();
		}
	}

	private void onDifferentTopic(MqttMessage message) {
		System.out.println(message.toString());
	}

	@Override
	public void deliveryComplete(IMqttDeliveryToken iMqttDeliveryToken) {

	}
}
