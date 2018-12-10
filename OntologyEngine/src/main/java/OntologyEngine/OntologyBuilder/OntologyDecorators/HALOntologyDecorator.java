package OntologyEngine.OntologyBuilder.OntologyDecorators;

import OntologyEngine.OntologyBuilder.Ontology;

import static OntologyEngine.OntologyBuilder.OntologyDecorators.OntologyStrings.*;

public class HALOntologyDecorator extends OntologyDecorator {
    public HALOntologyDecorator(Ontology ontology) {
        super(ontology);
    }

    @Override
    protected void decorate(Ontology ontology) {
        ontology.addSubclasses(SENSOR, TEMPERATURE_SENSOR, HUMIDITY_SENSOR, CUSTOM_SENSOR, MULTI_SENSOR);
    }

    @Override
    protected void addPrerequisiteDecorators(Ontology ontology) {
        new IoTOntologyDecorator(ontology);
    }
}
