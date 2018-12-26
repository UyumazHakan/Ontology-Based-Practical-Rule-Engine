package OntologyEngine.OntologyBuilder;

import org.apache.jena.ontology.ObjectProperty;
import org.apache.jena.ontology.OntClass;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.ontology.OntModelSpec;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.util.iterator.ExtendedIterator;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;

public class Ontology implements Cloneable, Serializable {
	private OntModel model;
	private ArrayList<Class> decorators = new ArrayList<>();


	private String namespace;
	private HashMap<String, OntClass> classes = new HashMap<>();
	private HashMap<String, ObjectProperty> objectProperties = new HashMap<>();

	public Ontology() {
		this("http://example.com#");
	}

	public Ontology(String namespace) {
		this.namespace = namespace;
		this.model = ModelFactory.createOntologyModel(OntModelSpec.OWL_MEM_RULE_INF);
	}

	public Ontology(InputStream inputStream) {
		this();
		this.model.read(inputStream, null);
		ExtendedIterator classes = this.model.listClasses();
		while (classes.hasNext()) {
			OntClass ontClass = (OntClass) classes.next();
			this.classes.put(ontClass.getLocalName(), ontClass);
		}
	}

	public String getNamespace() {
		return namespace;
	}

	public void setNamespace(String namespace) {
		this.namespace = namespace;
	}

	public void print() {
		model.write(System.out);
	}

	public void addDecorator(Class... decorators) {
		for (int i = 0; i < decorators.length; i++) {
			if (this.decorators.contains(decorators[i]))
				this.decorators.add(decorators[i]);
		}
	}

	public boolean isDecoratedWith(Class decorator) {
		return this.decorators.contains(decorator);
	}

	public void addClass(String name) {
		classes.put(name, this.model.createClass(namespace + name));
	}

	public void addClass(String... names) {
		for (String name : names) {
			this.addClass(name);
		}
	}

	public void addSubclass(String parent, String name) {
		if (!this.classes.containsKey(name))
			this.addClass(name);
		this.classes.get(name).addSuperClass(this.classes.get(parent));
	}

	public void addSubclasses(String parent, String... names) {
		for (String name : names) {
			this.addSubclass(parent, name);
		}
	}

	public void addSuperclass(String child, String name) {
		if (!this.classes.containsKey(name))
			this.addClass(name);
		this.classes.get(name).addSubClass(this.classes.get(child));

	}

	public void addSuperclasses(String child, String... names) {
		for (String name : names) {
			this.addSuperclass(child, name);
		}
	}

	public void addIntersectionClass(String intersection, String... names) {
		OntClass[] classesToIntersect = new OntClass[names.length];
		for (int i = 0; i < names.length; i++) {
			if (!this.classes.containsKey(names[i]))
				this.addClass(names[i]);
			classesToIntersect[i] = this.classes.get(names[i]);
		}
		this.classes.put(intersection, this.model.createIntersectionClass(namespace + intersection,
				this.model.createList(classesToIntersect)));
	}

	public void addComplementClass(String complement, String name) {
		this.classes.put(complement, this.model.createComplementClass(namespace + complement,
				this.classes.get(name)));
	}

	public void addObjectProperty(String name, String domain, String range) {
		ObjectProperty property = this.model.createObjectProperty(namespace + name);
		property.addDomain(this.classes.get(domain));
		property.addRange(this.classes.get(range));
		this.objectProperties.put(name, property);
	}

	public void addSubObjectProperty(String name, String subProperty){
		if (this.objectProperties.get(name) == null || this.objectProperties.get(subProperty) == null)
		System.err.println(name + subProperty);
		this.objectProperties.get(name).addSubProperty(this.objectProperties.get(subProperty));
	}

	public void addSubObjectProperties(String name, String... subProperties){
		for(String property : subProperties)
			this.addSubObjectProperty(name, property);
	}

	public void addAllValuesFromConstraint(String name, String property, String cls) {
		this.model.createAllValuesFromRestriction(name, this.objectProperties.get(property), this.classes.get(cls));
	}

	public void addOntology(String url) {
		this.model.read(url);
		ExtendedIterator classes = this.model.listClasses();
		while (classes.hasNext()) {
			OntClass ontClass = (OntClass) classes.next();
			this.classes.put(ontClass.getLocalName(), ontClass);
		}
	}

	public void save(String location) {
		try {
			File file = new File(location);
			file.createNewFile();
			FileWriter fw = new FileWriter(file);
			this.model.write(fw, "RDF/XML-ABBREV");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}


	public OntClass getClass(String name) {
		return this.classes.get(name);
	}

	public Ontology clone() throws CloneNotSupportedException {
		return (Ontology) super.clone();
	}
}
