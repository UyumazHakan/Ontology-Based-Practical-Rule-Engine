package OntologyEngine;

import OntologyEngine.OntologyBuilder.Ontology;
import OntologyEngine.OntologyBuilder.OntologyBuilder;
import OntologyEngine.OntologyBuilder.OntologyDecorators.HALOntologyDecorator;

public class App {
    public static void main(String[] args) {
        OntologyBuilder.createIoTOntology().print();
        System.out.println("--------------");
        OntologyBuilder.createSSNOntology().print();
    }
}
