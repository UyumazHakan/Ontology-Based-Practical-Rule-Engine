package OntologyEngine;

import OntologyEngine.Communicator.MqttCommunicator;
import OntologyEngine.Communicator.TopicStrings;
import OntologyEngine.OntologyBuilder.Ontology;
import OntologyEngine.OntologyBuilder.OntologyBuilder;
import OntologyEngine.OntologyBuilder.OntologyDecorators.HALOntologyDecorator;
import org.eclipse.paho.client.mqttv3.MqttException;

import static OntologyEngine.OntologyBuilder.OntologyDecorators.OntologyStrings.*;

public class App {
    public static void main(String[] args) {
        MqttCommunicator mqtt = MqttCommunicator.createInstance("tcp://localhost:1883");
        try {
            mqtt.subscribe(TopicStrings.ONTOLOGY_CREATE);
            mqtt.subscribe(TopicStrings.ONTOLOGY_QUERY);
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }
}
