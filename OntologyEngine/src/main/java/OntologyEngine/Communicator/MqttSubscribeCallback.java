package OntologyEngine.Communicator;

import OntologyEngine.OntologyBuilder.Ontology;
import OntologyEngine.OntologyBuilder.OntologyBuilder;
import OntologyEngine.OntologyBuilder.OntologyDecorators.OntologyStrings;
import org.apache.jena.ontology.Individual;
import org.apache.jena.util.iterator.ExtendedIterator;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.util.Iterator;

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
			Individual individual = ontology.createAnonymousIndividual(OntologyStrings.DATA);
			Iterator it = data.keySet().iterator();
			while(it.hasNext()){
				String fieldName = (String) it.next();
				fieldName = fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1).toLowerCase() + "Field";
				ontology.addPropertyToIndividual(individual, OntologyStrings.HAS_FIELD, fieldName);
			}
			if(data.containsKey("id")) {
				String id = (String) data.get("id");
				ontology.addPropertyToIndividual(individual, OntologyStrings.HAS_ID_FIELD, id);
			}
			ontology.runReasoner(individual.getURI());


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
