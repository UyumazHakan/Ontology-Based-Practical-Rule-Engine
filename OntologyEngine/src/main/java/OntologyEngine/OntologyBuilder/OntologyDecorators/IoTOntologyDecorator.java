package OntologyEngine.OntologyBuilder.OntologyDecorators;

import OntologyEngine.OntologyBuilder.Ontology;
import static OntologyEngine.OntologyBuilder.OntologyDecorators.OntologyStrings.*;

public class IoTOntologyDecorator extends OntologyDecorator {

    public IoTOntologyDecorator(Ontology ontology) {
        super(ontology);
    }

    @Override
    protected void decorate(Ontology ontology) {
        ontology.addClass(OBJECT);
        ontology.addClass(FIELD);
        ontology.addSubclasses(OBJECT, INTERNET_THING, DATA);
        ontology.addSubclasses(INTERNET_THING, SENSOR, ACTUATOR);
        ontology.addSubclasses(SENSOR, KNOWN_TYPE_SENSOR, UNKNOWN_TYPE_SENSOR);
        ontology.addComplementClass(UNKNOWN_TYPE_SENSOR, KNOWN_TYPE_SENSOR);
        ontology.addObjectProperty(HAS_FIELD, DATA, FIELD);
        ontology.addObjectProperty(FROM_SENSOR, DATA, SENSOR);
    }

    @Override
    protected void addPrerequisiteDecorators(Ontology ontology) {
    }
}
