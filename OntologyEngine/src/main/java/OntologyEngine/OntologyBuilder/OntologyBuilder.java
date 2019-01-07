package OntologyEngine.OntologyBuilder;

import OntologyEngine.OntologyBuilder.OntologyDecorators.HALOntologyDecorator;
import OntologyEngine.OntologyBuilder.OntologyDecorators.IoTOntologyDecorator;
import OntologyEngine.OntologyBuilder.OntologyDecorators.OntologyStrings;
import OntologyEngine.OntologyBuilder.OntologyDecorators.SSNOntologyDecorator;

import java.io.*;
import java.util.HashMap;

public class OntologyBuilder {
	public static final String fileExtension = ".owl";
	private static final String storageDirectory = "." + File.separator + "storage" + File.separator;
	private static HashMap<String, Ontology> ontologyCache = new HashMap<>();

	public static Ontology getHALOntology(String id) {
		if (ontologyCache.containsKey(id))
			return ontologyCache.get(id);
		InputStream file = null;
		try {
			file = new FileInputStream(new File(storageDirectory + id + fileExtension));
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
		Ontology ontology;
		if (file == null)
			return null;
		else
			ontology = new Ontology(file);
		ontologyCache.put(id, ontology);
		return ontology;
	}

	public static void saveOntology(String id) {
		File saveFolder = new File(storageDirectory);
		if (!saveFolder.exists())
			saveFolder.mkdirs();
		Ontology ontology = getHALOntology(id);
		if (ontology == null) ontology = createHALOntology();
		ontology.save(storageDirectory + id + fileExtension);
	}
	public static void updateOntology(String id, InputStream inputStream) {
		if (ontologyCache.containsKey(id)) ontologyCache.remove(id);
		Ontology ontology = new Ontology(inputStream);
		ontology.save(storageDirectory + id + fileExtension);
		ontologyCache.put(id, ontology);
	}

	private static Ontology createSSNOntology() {
		Ontology ontology = new Ontology();
		new SSNOntologyDecorator(ontology);
		return ontology;
	}

	private static Ontology createIoTOntology() {
		Ontology ontology = new Ontology();
		new IoTOntologyDecorator(ontology);
		return ontology;
	}

	private static Ontology createHALOntology() {
		Ontology ontology = createIoTOntology();
		new HALOntologyDecorator(ontology);
		return ontology;
	}
}
