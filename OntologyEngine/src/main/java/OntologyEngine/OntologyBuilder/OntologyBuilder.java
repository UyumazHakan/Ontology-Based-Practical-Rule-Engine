package OntologyEngine.OntologyBuilder;

import OntologyEngine.OntologyBuilder.OntologyDecorators.HALOntologyDecorator;
import OntologyEngine.OntologyBuilder.OntologyDecorators.IoTOntologyDecorator;
import OntologyEngine.OntologyBuilder.OntologyDecorators.SSNOntologyDecorator;

public class OntologyBuilder {
    private static Ontology SSNOntology;
    private static Ontology IoTOntology;
    private static Ontology HALOntology;
    public static Ontology createSSNOntology(){
        if (SSNOntology == null){
            SSNOntology = new Ontology();
            new SSNOntologyDecorator(SSNOntology);
        }
        try {
            return SSNOntology.clone();
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
            return null;
        }
    }
    public static Ontology createIoTOntology(){
        if (IoTOntology == null){
            IoTOntology = createSSNOntology();
            new IoTOntologyDecorator(IoTOntology);
        }
        try {
            return IoTOntology.clone();
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
            return null;
        }
    }
    public  static Ontology createHALOntology(){
        if(HALOntology == null){
            HALOntology = createIoTOntology();
            new HALOntologyDecorator(HALOntology);
        }
        try {
            return HALOntology.clone();
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
            return null;
        }
    }
}
