package OntologyEngine.OntologyBuilder.OntologyDecorators;

import OntologyEngine.OntologyBuilder.Ontology;

public class SSNOntologyDecorator extends OntologyDecorator {
    public SSNOntologyDecorator(Ontology ontology) {
        super(ontology);
    }

    @Override
    protected void decorate(Ontology ontology) {
        ontology.addOntology("http://purl.oclc.org/NET/ssnx/ssn");
    }
}
