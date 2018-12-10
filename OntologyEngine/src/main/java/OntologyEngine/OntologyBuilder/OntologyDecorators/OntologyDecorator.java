package OntologyEngine.OntologyBuilder.OntologyDecorators;

import OntologyEngine.OntologyBuilder.Ontology;

public abstract class OntologyDecorator {
    public OntologyDecorator(Ontology ontology) {
        if (ontology.isDecoratedWith(this.getClass())) return;
        ontology.addDecorator(this.getClass());
        this.addPrerequisiteDecorators(ontology);
        this.decorate(ontology);

    }

    protected abstract void decorate(Ontology ontology);

    protected void addPrerequisiteDecorators(Ontology ontology) {
    }

}
