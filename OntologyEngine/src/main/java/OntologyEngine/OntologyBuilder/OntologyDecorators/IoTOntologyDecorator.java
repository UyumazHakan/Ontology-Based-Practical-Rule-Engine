package OntologyEngine.OntologyBuilder.OntologyDecorators;

import OntologyEngine.OntologyBuilder.Ontology;
import static OntologyEngine.OntologyBuilder.OntologyDecorators.OntologyStrings.*;

public class IoTOntologyDecorator extends OntologyDecorator {

    public IoTOntologyDecorator(Ontology ontology) {
        super(ontology);
    }

    @Override
    protected void decorate(Ontology ontology) {
        ontology.addSubclass(OBJECT, INTERNET_THING);
        ontology.addSubclasses(INTERNET_THING, SENSOR, ACTUATOR);
    }

    @Override
    protected void addPrerequisiteDecorators(Ontology ontology) {
        new SSNOntologyDecorator(ontology);
    }
}
