package OntologyEngine.OntologyBuilder;

import org.semanticweb.HermiT.Reasoner;
import org.semanticweb.HermiT.ReasonerFactory;
import org.semanticweb.owlapi.apibinding.OWLManager;
import org.semanticweb.owlapi.model.*;
import org.semanticweb.owlapi.reasoner.OWLReasoner;
import org.semanticweb.owlapi.util.ShortFormProvider;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;

public class Ontology implements Cloneable, Serializable {
    private ArrayList<Class> decorators = new ArrayList<>();


    private IRI namespace;
    private HashMap<String, OWLClass> classes = new HashMap<>();
    private HashMap<String, OWLObjectProperty> objectProperties = new HashMap();
    private HashMap<String, OWLDataProperty> dataProperties = new HashMap();
    private HashMap<String, OWLObjectRestriction> restrictions = new HashMap();

    private OWLOntologyManager manager;
    private OWLOntology model;
    private OWLDataFactory dataFactory;
    private ShortFormProvider shortFormProvider;

    public Ontology() {
        this("http://example.com#");
    }

    public Ontology(String namespace) {
        this.namespace = IRI.create(namespace);
        this.dataFactory = OWLManager.getOWLDataFactory();
        this.manager = OWLManager.createOWLOntologyManager();
        try {
            this.model = this.manager.createOntology(this.namespace);
        } catch (OWLOntologyCreationException e) {
            e.printStackTrace();
        }
    }

    public Ontology(InputStream inputStream) {
        this.namespace =  IRI.create("http://example.com#");
        this.dataFactory = OWLManager.getOWLDataFactory();
        this.manager = OWLManager.createOWLOntologyManager();
        try {
            this.model = this.manager.loadOntologyFromOntologyDocument(inputStream);
        } catch (OWLOntologyCreationException e) {
            e.printStackTrace();
        }
    }

    public IRI getNamespace() {
        return namespace;
    }

    public void setNamespace(String namespace) {
        this.namespace = IRI.create(namespace);
    }

    private IRI getURI(String extension) { return IRI.create(namespace + "#" + extension); }

    public void print() {
        try {
            manager.saveOntology(model, System.out);
        } catch (OWLOntologyStorageException e) {
            e.printStackTrace();
        }
    }

    public void addDecorator(Class... decorators) {
        for (Class decorator : decorators) {
            if (this.decorators.contains(decorator))
                this.decorators.add(decorator);
        }
    }

    public boolean isDecoratedWith(Class decorator) {
        return this.decorators.contains(decorator);
    }

    public void addClass(String name) {
        OWLClass cls = dataFactory.getOWLClass(getURI(name));
        OWLDeclarationAxiom dcl = dataFactory.getOWLDeclarationAxiom(cls);
        manager.addAxiom(model, dcl);
        classes.put(name, cls);
    }

    public void addClass(String... names) {
        for (String name : names) {
            this.addClass(name);
        }
    }

    public void addSubclass(String parent, String name) {
        if (!this.classes.containsKey(name))
            this.addClass(name);
        OWLSubClassOfAxiom axiom = dataFactory.getOWLSubClassOfAxiom(this.classes.get(name), this.classes.get(parent));
        manager.addAxiom(model, axiom);
    }

    public void addSubclasses(String parent, String... names) {
        for (String name : names) {
            this.addSubclass(parent, name);
        }
    }

    public void addSuperclass(String child, String name) {
        if (!this.classes.containsKey(name))
            this.addClass(name);
        OWLSubClassOfAxiom axiom = dataFactory.getOWLSubClassOfAxiom(this.classes.get(child), this.classes.get(name));
        manager.addAxiom(model, axiom);

    }

    public void addSuperclasses(String child, String... names) {
        for (String name : names) {
            this.addSuperclass(child, name);
        }
    }

    public void addIntersectionClass(String intersection, String... names) {
        OWLClassExpression[] classesToIntersect = new OWLClassExpression[names.length];
        for (int i = 0; i < names.length; i++) {
            if (!this.classes.containsKey(names[i]))
                this.addClass(names[i]);
            classesToIntersect[i] = this.classes.get(names[i]);
        }
        OWLClassExpression intersectionOf = dataFactory.getOWLObjectIntersectionOf(classesToIntersect);
        OWLClass cls = dataFactory.getOWLClass(getURI(intersection));
        OWLDeclarationAxiom dcl = dataFactory.getOWLDeclarationAxiom(cls);
        OWLEquivalentClassesAxiom axiom = dataFactory.getOWLEquivalentClassesAxiom(cls, intersectionOf);
        manager.addAxiom(model, dcl);
        manager.addAxiom(model, axiom);
        this.classes.put(intersection, cls);
    }

    public void addComplementClass(String complement, String name) {
        OWLClass cls = dataFactory.getOWLClass(getURI(complement));
        OWLDeclarationAxiom dcl = dataFactory.getOWLDeclarationAxiom(cls);
        OWLClassExpression complementOf = dataFactory.getOWLObjectComplementOf(this.classes.get(name));
        OWLEquivalentClassesAxiom axiom = dataFactory.getOWLEquivalentClassesAxiom(cls, complementOf);
        manager.addAxiom(model, dcl);
        manager.addAxiom(model, axiom);
        this.classes.put(complement, cls);
    }

    public void addObjectProperty(String name, String domain, String range) {
        OWLObjectProperty objectProperty = dataFactory.getOWLObjectProperty(getURI(name));
        OWLObjectPropertyDomainAxiom domainAxiom = dataFactory.getOWLObjectPropertyDomainAxiom(objectProperty,this.classes.get(domain));
        OWLObjectPropertyRangeAxiom rangeAxiom = dataFactory.getOWLObjectPropertyRangeAxiom(objectProperty,this.classes.get(range));
        OWLDeclarationAxiom dcl = dataFactory.getOWLDeclarationAxiom(objectProperty);
        manager.addAxiom(model, domainAxiom);
        manager.addAxiom(model, rangeAxiom);
        manager.addAxiom(model, dcl);
        this.objectProperties.put(name, objectProperty);
    }
    public void addDataProperty(String name){
        addDataProperty(name, null);
    }
    public void addDataProperty(String name, String domain){
        OWLDataProperty dataProperty = dataFactory.getOWLDataProperty(getURI(name));
        if (domain != null) {
            if(!classes.containsKey(domain)) addClass(domain);
            OWLDataPropertyDomainAxiom domainAxiom = dataFactory.getOWLDataPropertyDomainAxiom(dataProperty,
                    classes.get(domain));
            manager.addAxiom(model, domainAxiom);
        }
        OWLDeclarationAxiom dcl = dataFactory.getOWLDeclarationAxiom(dataProperty);
        manager.addAxiom(model, dcl);
        this.dataProperties.put(name, dataProperty);
    }

    public void addSubObjectProperty(String name, String subProperty) {
        OWLSubObjectPropertyOfAxiom subObjectPropertyOfAxiom = dataFactory.getOWLSubObjectPropertyOfAxiom(this.objectProperties.get(subProperty), this.objectProperties.get(name));
        manager.addAxiom(model, subObjectPropertyOfAxiom);
    }

    public void addSubObjectProperties(String name, String... subProperties) {
        for (String property : subProperties)
            this.addSubObjectProperty(name, property);
    }

    public void addRestrictionEquivalentClass(String name, String restriction) {
        OWLClass cls = dataFactory.getOWLClass(getURI(name));
        OWLDeclarationAxiom dcl = dataFactory.getOWLDeclarationAxiom(cls);
        OWLEquivalentClassesAxiom equivalentClassesAxiom = dataFactory.getOWLEquivalentClassesAxiom(cls, restrictions.get(restriction));
        manager.addAxiom(model, dcl);
        manager.addAxiom(model, equivalentClassesAxiom);
    }

    public void addSomeValuesFromRestriction(String name, String property, String cls) {
        OWLObjectSomeValuesFrom someValuesFrom = dataFactory.getOWLObjectSomeValuesFrom(this.objectProperties.get(property), this.classes.get(cls));
        this.restrictions.put(name,  someValuesFrom);
    }
    public void addObjectPropertyToIndividual(OWLIndividual individual, String property, OWLIndividual object) {
        OWLObjectPropertyAssertionAxiom assertionAxiom = dataFactory.getOWLObjectPropertyAssertionAxiom(objectProperties.get(property),individual, object);
        manager.addAxiom(model, assertionAxiom);
    }
    public void addObjectPropertyToIndividual(OWLIndividual individual, String property, String cls) {
        addObjectPropertyToIndividual(individual, property, createAnonymousIndividual(cls));
    }
    public void addDataPropertyToIndividual(OWLIndividual individual, String property, int literal){
        if (!dataProperties.containsKey(property)) addDataProperty(property);
        OWLDataHasValue hasValue = dataFactory.getOWLDataHasValue(dataProperties.get(property),
                dataFactory.getOWLLiteral(literal));
        OWLClassAssertionAxiom classAssertionAxiom = dataFactory.getOWLClassAssertionAxiom(hasValue, individual);
        manager.addAxiom(model, classAssertionAxiom);
    }
    public void addDataPropertyToIndividual(OWLIndividual individual, String property, float literal){
        if (!dataProperties.containsKey(property)) addDataProperty(property);
        OWLDataHasValue hasValue = dataFactory.getOWLDataHasValue(dataProperties.get(property),
                dataFactory.getOWLLiteral(literal));
        OWLClassAssertionAxiom classAssertionAxiom = dataFactory.getOWLClassAssertionAxiom(hasValue, individual);
        manager.addAxiom(model, classAssertionAxiom);
    }
    public void addDataPropertyToIndividual(OWLIndividual individual, String property, double literal){
        if (!dataProperties.containsKey(property)) addDataProperty(property);
        OWLDataHasValue hasValue = dataFactory.getOWLDataHasValue(dataProperties.get(property),
                dataFactory.getOWLLiteral(literal));
        OWLClassAssertionAxiom classAssertionAxiom = dataFactory.getOWLClassAssertionAxiom(hasValue, individual);
        manager.addAxiom(model, classAssertionAxiom);
    }
    public void addDataPropertyToIndividual(OWLIndividual individual, String property, boolean literal){
        if (!dataProperties.containsKey(property)) addDataProperty(property);
        OWLDataHasValue hasValue = dataFactory.getOWLDataHasValue(dataProperties.get(property),
                dataFactory.getOWLLiteral(literal));
        OWLClassAssertionAxiom classAssertionAxiom = dataFactory.getOWLClassAssertionAxiom(hasValue, individual);
        manager.addAxiom(model, classAssertionAxiom);
    }
    public void addDataPropertyToIndividual(OWLIndividual individual, String property, String literal){
        if (!dataProperties.containsKey(property)) addDataProperty(property);
        OWLDataHasValue hasValue = dataFactory.getOWLDataHasValue(dataProperties.get(property),
                dataFactory.getOWLLiteral(literal));
        OWLClassAssertionAxiom classAssertionAxiom = dataFactory.getOWLClassAssertionAxiom(hasValue, individual);
        manager.addAxiom(model, classAssertionAxiom);
    }
    public OWLNamedIndividual createNamedIndividual(String name, String cls) {
        OWLNamedIndividual individual = dataFactory.getOWLNamedIndividual(getURI(name));
        OWLClassAssertionAxiom classAssertionAxiom = dataFactory.getOWLClassAssertionAxiom(this.classes.get(cls),
                individual);
        manager.addAxiom(model, classAssertionAxiom);
        return individual;
    }
    public OWLAnonymousIndividual createAnonymousIndividual(String cls) {
        OWLAnonymousIndividual individual = dataFactory.getOWLAnonymousIndividual();
        OWLClassAssertionAxiom classAssertionAxiom = dataFactory.getOWLClassAssertionAxiom(this.classes.get(cls), individual);
        manager.addAxiom(model,classAssertionAxiom);
        return individual;
    }


    public void addOntology(String url) {
        //TODO
    }

    public void save(String location) {
        try {
            File file = new File(location);
            file.createNewFile();
            FileOutputStream fileOutputStream = new FileOutputStream(file);
            manager.saveOntology(model, fileOutputStream);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (OWLOntologyStorageException e) {
            e.printStackTrace();
        }
    }


    public OWLClass getClass(String name) {
        return this.classes.get(name);
    }

    public Ontology clone() throws CloneNotSupportedException {
        return (Ontology) super.clone();
    }

    public OWLReasoner getReasoner() {
        try {
            System.out.println(model.getOntologyID().getDefaultDocumentIRI());
            return new ReasonerFactory().createReasoner(model);
        }catch (Throwable e) {
            e.printStackTrace();
            return null;
        }
    }
}
