package OntologyEngine.Communicator;

import OntologyEngine.OntologyBuilder.OntologyBuilder;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class MqttSubscribeCallback implements MqttCallback {
	private static final JSONParser jsonParser = new JSONParser();

	@Override
	public void connectionLost(Throwable throwable) {

	}

	@Override
	public void messageArrived(String topic, MqttMessage message) throws Exception {
		switch (topic) {
			case TopicStrings.ONTOLOGY_CREATE:
				onOntologyCreate(message);
				break;
			default:
				onDifferentTopic(message);
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
