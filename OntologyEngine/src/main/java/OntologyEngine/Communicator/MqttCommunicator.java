package OntologyEngine.Communicator;

import org.eclipse.paho.client.mqttv3.*;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentLinkedQueue;

public class MqttCommunicator {
	private static final String clientID = "OntologyEngine";
	private static final int qos = 2;
	private static MqttCommunicator Instance;
	private String broker;
	private MqttAsyncClient client;
	private boolean isConnected = false;
	private ConcurrentLinkedQueue<String> topicsToSubscribe = new ConcurrentLinkedQueue();

	private MqttCommunicator(String broker) {
		this.broker = broker;
		MemoryPersistence persistence = new MemoryPersistence();
		try {
			this.client = new MqttAsyncClient(this.broker, clientID, persistence);
			this.client.setCallback(new MqttSubscribeCallback());
			connect();
		} catch (MqttException me) {
			me.printStackTrace();
		}

	}

	public static MqttCommunicator getInstance() {
		if (Instance == null)
			throw new IllegalStateException("An instance must be created first");
		return Instance;
	}
	public static MqttCommunicator createInstance(String broker) {
		if (Instance == null)
			Instance = new MqttCommunicator(broker);
		else if (!Instance.getBroker().equals(broker))
			throw new IllegalArgumentException("An instance is already running cannot with " + broker);
		return Instance;
	}

	public void publish(String message, String topic) throws MqttException {
		if (!this.isConnected) throw new MqttException(MqttException.REASON_CODE_CLIENT_NOT_CONNECTED);
		MqttMessage mqttMessage = new MqttMessage(message.getBytes());
		mqttMessage.setQos(this.qos);
		this.client.publish(topic, mqttMessage);
	}
	public void subscribe(String topic) throws MqttException {
		while(!client.isConnected()){}
		this.client.subscribe(topic, this.qos);
	}

	public  void connect() {
		if (this.isConnected) return;
		try {
			MqttConnectOptions connectOptions = new MqttConnectOptions();
			connectOptions.setCleanSession(true);
			this.client.connect(connectOptions);
		} catch (MqttException me) {
			me.printStackTrace();
		}
	}
	public void disconnect() {
		if(!this.isConnected) return;
		try {
			this.client.disconnect();
			this.isConnected = false;
		} catch (MqttException me) {
			me.printStackTrace();
		}
	}

	public String getBroker() {
		return this.broker;
	}
}
