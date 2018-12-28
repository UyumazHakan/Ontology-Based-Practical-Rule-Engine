package OntologyEngine.OntologyBuilder.OntologyDecorators;

import OntologyEngine.OntologyBuilder.Ontology;

import static OntologyEngine.OntologyBuilder.OntologyDecorators.OntologyStrings.*;

public class HALOntologyDecorator extends OntologyDecorator {
    public HALOntologyDecorator(Ontology ontology) {
        super(ontology);
    }

    @Override
    protected void decorate(Ontology ontology) {
        ontology.addSubclasses(KNOWN_TYPE_SENSOR,
                TEMPERATURE_SENSOR,
                HUMIDITY_SENSOR,
                VIBRATION_SENSOR,
                MAGNETIC_FIELD_SENSOR,
                OPTICAL_INTERRUPTION_SENSOR,
                TILT_SENSOR,
                FLAME_SENSOR,
                OBSTACLE_SENSOR,
                TRACKING_SENSOR,
                METAL_TOUCH_SENSOR,
                SOUND_SENSOR,
                SEA_LEVEL_PRESSURE_SENSOR,
                PRESSURE_SENSOR,
                ALTITUDE_SENSOR,
                INFRARED_SENSOR,
                ULTRAVIOLET_SENSOR,
                VISIBILITY_SENSOR,
                ROLL_SENSOR,
                PITCH_SENSOR,
                YAW_SENSOR,
                ACCELERATION_SENSOR,
                GYROSCOPIC_SENSOR,
                CUSTOM_SENSOR,
                MULTI_SENSOR,
                ANALOG_SENSOR,
                DIGITAL_SENSOR);
        ontology.addSubclasses(TEMPERATURE_SENSOR, KY01, KY13, KY15, KY28, KY52, MYAHRS_PLUS_TEMPERATURE);
        ontology.addSubclasses(HUMIDITY_SENSOR, KY15, WEATHER2_BOARD_HUMIDITY);
        ontology.addSubclasses(VIBRATION_SENSOR, KY02, KY31);
        ontology.addSubclasses(MAGNETIC_FIELD_SENSOR, KY03, KY21, KY24, KY25, KY35, MYAHRS_PLUS_MAG_X,
                MYAHRS_PLUS_MAG_Y, MYAHRS_PLUS_MAG_Z);
        ontology.addSubclasses(OPTICAL_INTERRUPTION_SENSOR, KY10);
        ontology.addSubclasses(TILT_SENSOR, KY17, KY20);
        ontology.addSubclasses(FLAME_SENSOR, KY26);
        ontology.addSubclasses(OBSTACLE_SENSOR, KY32);
        ontology.addSubclasses(TRACKING_SENSOR, KY33);
        ontology.addSubclasses(METAL_TOUCH_SENSOR, KY36);
        ontology.addSubclasses(SOUND_SENSOR, KY37);
        ontology.addSubclasses(SEA_LEVEL_PRESSURE_SENSOR, KY52);
        ontology.addSubclasses(PRESSURE_SENSOR, KY52, WEATHER2_BOARD_PRESSURE);
        ontology.addSubclasses(ALTITUDE_SENSOR, KY52, WEATHER2_BOARD_ALTITUDE);
        ontology.addSubclasses(INFRARED_SENSOR, WEATHER2_BOARD_IR);
        ontology.addSubclasses(ULTRAVIOLET_SENSOR, WEATHER2_BOARD_UV);
        ontology.addSubclasses(VISIBILITY_SENSOR, WEATHER2_BOARD_VISIBILITY);
        ontology.addSubclasses(ROLL_SENSOR, MYAHRS_PLUS_ROLL);
        ontology.addSubclasses(PITCH_SENSOR, MYAHRS_PLUS_PITCH);
        ontology.addSubclasses(YAW_SENSOR, MYAHRS_PLUS_YAW);
        ontology.addSubclasses(ACCELERATION_SENSOR, MYAHRS_PLUS_ACCEL_X, MYAHRS_PLUS_ACCEL_Y, MYAHRS_PLUS_ACCEL_Z);
        ontology.addSubclasses(GYROSCOPIC_SENSOR, MYAHRS_PLUS_GYRO_X, MYAHRS_PLUS_GYRO_Y, MYAHRS_PLUS_GYRO_Z);
        ontology.addSubclasses(MULTI_SENSOR, KY15, KY52, WEATHER2_BOARD, MYAHRS_PLUS);
        ontology.addSuperclasses(WEATHER2_BOARD, WEATHER2_BOARD_ALTITUDE, WEATHER2_BOARD_HUMIDITY, WEATHER2_BOARD_IR,
                WEATHER2_BOARD_PRESSURE,
                WEATHER2_BOARD_UV, WEATHER2_BOARD_VISIBILITY);
        ontology.addSuperclasses(MYAHRS_PLUS,
                MYAHRS_PLUS_PITCH,
                MYAHRS_PLUS_ROLL,
                MYAHRS_PLUS_TEMPERATURE,
                MYAHRS_PLUS_YAW,
                MYAHRS_PLUS_ACCEL_X,
                MYAHRS_PLUS_ACCEL_Y,
                MYAHRS_PLUS_ACCEL_Z
                ,
                MYAHRS_PLUS_GYRO_X,
                MYAHRS_PLUS_GYRO_Y,
                MYAHRS_PLUS_GYRO_Z,
                MYAHRS_PLUS_MAG_X,
                MYAHRS_PLUS_MAG_Y,
                MYAHRS_PLUS_MAG_Z);
        ontology.addSubclasses(ANALOG_SENSOR,
                KY01,
                KY13,
                KY24,
                KY28,
                KY35,
                KY36,
                KY37,
                KY52,
                WEATHER2_BOARD_ALTITUDE,
                WEATHER2_BOARD_HUMIDITY,
                WEATHER2_BOARD_IR,
                WEATHER2_BOARD_PRESSURE,
                WEATHER2_BOARD_UV,
                WEATHER2_BOARD_VISIBILITY,
                MYAHRS_PLUS_PITCH,
                MYAHRS_PLUS_ROLL,
                MYAHRS_PLUS_TEMPERATURE,
                MYAHRS_PLUS_YAW,
                MYAHRS_PLUS_ACCEL_X,
                MYAHRS_PLUS_ACCEL_Y,
                MYAHRS_PLUS_ACCEL_Z,
                MYAHRS_PLUS_GYRO_X,
                MYAHRS_PLUS_GYRO_Y,
                MYAHRS_PLUS_GYRO_Z,
                MYAHRS_PLUS_MAG_X,
                MYAHRS_PLUS_MAG_Y,
                MYAHRS_PLUS_MAG_Z);
        ontology.addSubclasses(DIGITAL_SENSOR, KY02, KY03, KY21, KY24, KY26, KY28, KY31, KY32, KY33, KY36, KY37);
        ontology.addIntersectionClass(ANALOG_AND_DIGITAL_SENSOR, ANALOG_SENSOR, DIGITAL_SENSOR);
        ontology.addSubclasses(FIELD, TEMPERATURE_FIELD, HUMIDITY_FIELD, VIBRATION_FIELD, MAGNETIC_FIELD_FIELD,
                OPTICAL_INTERRUPTION_FIELD, TILT_FIELD, FLAME_FIELD, OBSTACLE_FIELD, TRACKING_FIELD,
                METAL_TOUCH_FIELD, SOUND_FIELD, SEA_LEVEL_PRESSURE_FIELD, PRESSURE_FIELD, ALTITUDE_FIELD,
                INFRARED_FIELD, ULTRAVIOLET_FIELD, VISIBILITY_FIELD, ROLL_FIELD, PITCH_FIELD, YAW_FIELD,
                ACCELERATION_FIELD, GYROSCOPIC_FIELD);
        ontology.addObjectProperty(HAS_FIELD, DATA, FIELD);
        ontology.addObjectProperty(HAS_ID_FIELD, DATA, SENSOR);
        ontology.addObjectProperty(HAS_TEMPERATURE_FIELD, DATA, TEMPERATURE_FIELD);
        ontology.addObjectProperty(HAS_HUMIDITY_FIELD, DATA, HUMIDITY_FIELD);
        ontology.addObjectProperty(HAS_VIBRATION_FIELD, DATA, VIBRATION_FIELD);
        ontology.addObjectProperty(HAS_MAGNETIC_FIELD_FIELD, DATA, MAGNETIC_FIELD_FIELD);
        ontology.addObjectProperty(HAS_OPTICAL_INTERRUPTION_FIELD, DATA, OPTICAL_INTERRUPTION_FIELD);
        ontology.addObjectProperty(HAS_TILT_FIELD, DATA, TILT_FIELD);
        ontology.addObjectProperty(HAS_FLAME_FIELD, DATA, FLAME_FIELD);
        ontology.addObjectProperty(HAS_OBSTACLE_FIELD, DATA, OBSTACLE_FIELD);
        ontology.addObjectProperty(HAS_TRACKING_FIELD, DATA, TRACKING_FIELD);
        ontology.addObjectProperty(HAS_METAL_TOUCH_FIELD, DATA, METAL_TOUCH_FIELD);
        ontology.addObjectProperty(HAS_SOUND_FIELD, DATA, SOUND_FIELD);
        ontology.addObjectProperty(HAS_SEA_LEVEL_PRESSURE_FIELD, DATA, SEA_LEVEL_PRESSURE_FIELD);
        ontology.addObjectProperty(HAS_PRESSURE_FIELD, DATA, PRESSURE_FIELD);
        ontology.addObjectProperty(HAS_ALTITUDE_FIELD, DATA, ALTITUDE_FIELD);
        ontology.addObjectProperty(HAS_INFRARED_FIELD, DATA, INFRARED_FIELD);
        ontology.addObjectProperty(HAS_ULTRAVIOLET_FIELD, DATA, ULTRAVIOLET_FIELD);
        ontology.addObjectProperty(HAS_VISIBILITY_FIELD, DATA, VISIBILITY_FIELD);
        ontology.addObjectProperty(HAS_ROLL_FIELD, DATA, ROLL_FIELD);
        ontology.addObjectProperty(HAS_PITCH_FIELD, DATA, PITCH_FIELD);
        ontology.addObjectProperty(HAS_YAW_FIELD, DATA, YAW_FIELD);
        ontology.addObjectProperty(HAS_ACCELERATION_FIELD, DATA, ACCELERATION_FIELD);
        ontology.addObjectProperty(HAS_GYROSCOPIC_FIELD, DATA, GYROSCOPIC_FIELD);
        ontology.addSubObjectProperties(HAS_FIELD,
                HAS_ID_FIELD,
                HAS_TEMPERATURE_FIELD,
                HAS_HUMIDITY_FIELD,
                HAS_VIBRATION_FIELD,
                HAS_MAGNETIC_FIELD_FIELD,
                HAS_OPTICAL_INTERRUPTION_FIELD,
                HAS_TILT_FIELD,
                HAS_FLAME_FIELD,
                HAS_OBSTACLE_FIELD,
                HAS_TRACKING_FIELD,
                HAS_METAL_TOUCH_FIELD,
                HAS_SOUND_FIELD,
                HAS_SEA_LEVEL_PRESSURE_FIELD,
                HAS_PRESSURE_FIELD,
                HAS_ALTITUDE_FIELD,
                HAS_INFRARED_FIELD,
                HAS_ULTRAVIOLET_FIELD,
                HAS_VISIBILITY_FIELD,
                HAS_ROLL_FIELD,
                HAS_PITCH_FIELD,
                HAS_YAW_FIELD,
                HAS_ACCELERATION_FIELD,
                HAS_GYROSCOPIC_FIELD);
        ontology.addObjectProperty(FROM_TEMPERATURE_SENSOR, DATA, TEMPERATURE_SENSOR);
        ontology.addObjectProperty(FROM_HUMIDITY_SENSOR, DATA, HUMIDITY_SENSOR);
        ontology.addObjectProperty(FROM_VIBRATION_SENSOR, DATA, VIBRATION_SENSOR);
        ontology.addObjectProperty(FROM_MAGNETIC_FIELD_SENSOR, DATA, MAGNETIC_FIELD_SENSOR);
        ontology.addObjectProperty(FROM_OPTICAL_INTERRUPTION_SENSOR, DATA, OPTICAL_INTERRUPTION_SENSOR);
        ontology.addObjectProperty(FROM_TILT_SENSOR, DATA, TILT_SENSOR);
        ontology.addObjectProperty(FROM_FLAME_SENSOR, DATA, FLAME_SENSOR);
        ontology.addObjectProperty(FROM_OBSTACLE_SENSOR, DATA, OBSTACLE_SENSOR);
        ontology.addObjectProperty(FROM_TRACKING_SENSOR, DATA, TRACKING_SENSOR);
        ontology.addObjectProperty(FROM_METAL_TOUCH_SENSOR, DATA, METAL_TOUCH_SENSOR);
        ontology.addObjectProperty(FROM_SOUND_SENSOR, DATA, SOUND_SENSOR);
        ontology.addObjectProperty(FROM_SEA_LEVEL_PRESSURE_SENSOR, DATA, SEA_LEVEL_PRESSURE_SENSOR);
        ontology.addObjectProperty(FROM_PRESSURE_SENSOR, DATA, PRESSURE_SENSOR);
        ontology.addObjectProperty(FROM_ALTITUDE_SENSOR, DATA, ALTITUDE_SENSOR);
        ontology.addObjectProperty(FROM_INFRARED_SENSOR, DATA, INFRARED_SENSOR);
        ontology.addObjectProperty(FROM_ULTRAVIOLET_SENSOR, DATA, ULTRAVIOLET_SENSOR);
        ontology.addObjectProperty(FROM_VISIBILITY_SENSOR, DATA, VISIBILITY_SENSOR);
        ontology.addObjectProperty(FROM_ROLL_SENSOR, DATA, ROLL_SENSOR);
        ontology.addObjectProperty(FROM_PITCH_SENSOR, DATA, PITCH_SENSOR);
        ontology.addObjectProperty(FROM_YAW_SENSOR, DATA, YAW_SENSOR);
        ontology.addObjectProperty(FROM_ACCELERATION_SENSOR, DATA, ACCELERATION_SENSOR);
        ontology.addObjectProperty(FROM_GYROSCOPIC_SENSOR, DATA, GYROSCOPIC_SENSOR);
        ontology.addSubObjectProperties(FROM_SENSOR,
                FROM_TEMPERATURE_SENSOR,
                FROM_HUMIDITY_SENSOR,
                FROM_VIBRATION_SENSOR,
                FROM_MAGNETIC_FIELD_SENSOR,
                FROM_OPTICAL_INTERRUPTION_SENSOR,
                FROM_TILT_SENSOR,
                FROM_FLAME_SENSOR,
                FROM_OBSTACLE_SENSOR,
                FROM_TRACKING_SENSOR,
                FROM_METAL_TOUCH_SENSOR,
                FROM_SOUND_SENSOR,
                FROM_SEA_LEVEL_PRESSURE_SENSOR,
                FROM_PRESSURE_SENSOR,
                FROM_ALTITUDE_SENSOR,
                FROM_INFRARED_SENSOR,
                FROM_ULTRAVIOLET_SENSOR,
                FROM_VISIBILITY_SENSOR,
                FROM_ROLL_SENSOR,
                FROM_PITCH_SENSOR,
                FROM_YAW_SENSOR,
                FROM_ACCELERATION_SENSOR,
                FROM_GYROSCOPIC_SENSOR);
        ontology.addSubclasses(DATA,
                TEMPERATURE_DATA,
                HUMIDITY_DATA,
                VIBRATION_DATA,
                MAGNETIC_FIELD_DATA,
                OPTICAL_INTERRUPTION_DATA,
                TILT_DATA,
                FLAME_DATA,
                OBSTACLE_DATA,
                TRACKING_DATA,
                METAL_TOUCH_DATA,
                SOUND_DATA,
                SEA_LEVEL_PRESSURE_DATA,
                PRESSURE_DATA,
                ALTITUDE_DATA,
                INFRARED_DATA,
                ULTRAVIOLET_DATA,
                VISIBILITY_DATA,
                ROLL_DATA,
                PITCH_DATA,
                YAW_DATA,
                ACCELERATION_DATA,
                GYROSCOPIC_DATA);
        ontology.addSubclasses(TEMPERATURE_DATA, DATA_WITH_TEMPERATURE_FIELD, DATA_WITH_TEMPERATURE_SENSOR_ID);
        ontology.addSubclasses(HUMIDITY_DATA, DATA_WITH_HUMIDITY_FIELD, DATA_WITH_HUMIDITY_SENSOR_ID);
        ontology.addSubclasses(VIBRATION_DATA, DATA_WITH_VIBRATION_FIELD, DATA_WITH_VIBRATION_SENSOR_ID);
        ontology.addSubclasses(MAGNETIC_FIELD_DATA, DATA_WITH_MAGNETIC_FIELD_FIELD, DATA_WITH_MAGNETIC_FIELD_SENSOR_ID);
        ontology.addSubclasses(OPTICAL_INTERRUPTION_DATA, DATA_WITH_OPTICAL_INTERRUPTION_FIELD, DATA_WITH_OPTICAL_INTERRUPTION_SENSOR_ID);
        ontology.addSubclasses(TILT_DATA, DATA_WITH_TILT_FIELD, DATA_WITH_TILT_SENSOR_ID);
        ontology.addSubclasses(FLAME_DATA, DATA_WITH_FLAME_FIELD, DATA_WITH_FLAME_SENSOR_ID);
        ontology.addSubclasses(OBSTACLE_DATA, DATA_WITH_OBSTACLE_FIELD, DATA_WITH_OBSTACLE_SENSOR_ID);
        ontology.addSubclasses(TRACKING_DATA, DATA_WITH_TRACKING_FIELD, DATA_WITH_TRACKING_SENSOR_ID);
        ontology.addSubclasses(METAL_TOUCH_DATA, DATA_WITH_METAL_TOUCH_FIELD, DATA_WITH_METAL_TOUCH_SENSOR_ID);
        ontology.addSubclasses(SOUND_DATA, DATA_WITH_SOUND_FIELD, DATA_WITH_SOUND_SENSOR_ID);
        ontology.addSubclasses(SEA_LEVEL_PRESSURE_DATA, DATA_WITH_SEA_LEVEL_PRESSURE_FIELD, DATA_WITH_SEA_LEVEL_PRESSURE_SENSOR_ID);
        ontology.addSubclasses(PRESSURE_DATA, DATA_WITH_PRESSURE_FIELD, DATA_WITH_PRESSURE_SENSOR_ID);
        ontology.addSubclasses(ALTITUDE_DATA, DATA_WITH_ALTITUDE_FIELD, DATA_WITH_ALTITUDE_SENSOR_ID);
        ontology.addSubclasses(INFRARED_DATA, DATA_WITH_INFRARED_FIELD, DATA_WITH_INFRARED_SENSOR_ID);
        ontology.addSubclasses(ULTRAVIOLET_DATA, DATA_WITH_ULTRAVIOLET_FIELD, DATA_WITH_ULTRAVIOLET_SENSOR_ID);
        ontology.addSubclasses(VISIBILITY_DATA, DATA_WITH_VISIBILITY_FIELD, DATA_WITH_VISIBILITY_SENSOR_ID);
        ontology.addSubclasses(ROLL_DATA, DATA_WITH_ROLL_FIELD, DATA_WITH_ROLL_SENSOR_ID);
        ontology.addSubclasses(PITCH_DATA, DATA_WITH_PITCH_FIELD, DATA_WITH_PITCH_SENSOR_ID);
        ontology.addSubclasses(YAW_DATA, DATA_WITH_YAW_FIELD, DATA_WITH_YAW_SENSOR_ID);
        ontology.addSubclasses(ACCELERATION_DATA, DATA_WITH_ACCELERATION_FIELD, DATA_WITH_ACCELERATION_SENSOR_ID);
        ontology.addSubclasses(GYROSCOPIC_DATA, DATA_WITH_GYROSCOPIC_FIELD, DATA_WITH_GYROSCOPIC_SENSOR_ID);
        ontology.addSomeValuesFromRestriction(HAS_SOME_TEMPERATURE_FIELD, HAS_FIELD, TEMPERATURE_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_HUMIDITY_FIELD, HAS_FIELD, HUMIDITY_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_VIBRATION_FIELD, HAS_FIELD, VIBRATION_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_MAGNETIC_FIELD_FIELD, HAS_FIELD, MAGNETIC_FIELD_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_OPTICAL_INTERRUPTION_FIELD, HAS_FIELD, OPTICAL_INTERRUPTION_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_TILT_FIELD, HAS_FIELD, TILT_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_FLAME_FIELD, HAS_FIELD, FLAME_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_OBSTACLE_FIELD, HAS_FIELD, OBSTACLE_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_TRACKING_FIELD, HAS_FIELD, TRACKING_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_METAL_TOUCH_FIELD, HAS_FIELD, METAL_TOUCH_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_SOUND_FIELD, HAS_FIELD, SOUND_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_SEA_LEVEL_PRESSURE_FIELD, HAS_FIELD, SEA_LEVEL_PRESSURE_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_PRESSURE_FIELD, HAS_FIELD, PRESSURE_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_ALTITUDE_FIELD, HAS_FIELD, ALTITUDE_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_INFRARED_FIELD, HAS_FIELD, INFRARED_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_ULTRAVIOLET_FIELD, HAS_FIELD, ULTRAVIOLET_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_VISIBILITY_FIELD, HAS_FIELD, VISIBILITY_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_ROLL_FIELD, HAS_FIELD, ROLL_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_PITCH_FIELD, HAS_FIELD, PITCH_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_YAW_FIELD, HAS_FIELD, YAW_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_ACCELERATION_FIELD, HAS_FIELD, ACCELERATION_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_GYROSCOPIC_FIELD, HAS_FIELD, GYROSCOPIC_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_TEMPERATURE_FIELD, HAS_SOME_TEMPERATURE_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_HUMIDITY_FIELD, HAS_SOME_HUMIDITY_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_VIBRATION_FIELD, HAS_SOME_VIBRATION_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_MAGNETIC_FIELD_FIELD, HAS_SOME_MAGNETIC_FIELD_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_OPTICAL_INTERRUPTION_FIELD, HAS_SOME_OPTICAL_INTERRUPTION_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_TILT_FIELD, HAS_SOME_TILT_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_FLAME_FIELD, HAS_SOME_FLAME_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_OBSTACLE_FIELD, HAS_SOME_OBSTACLE_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_TRACKING_FIELD, HAS_SOME_TRACKING_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_METAL_TOUCH_FIELD, HAS_SOME_METAL_TOUCH_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_SOUND_FIELD, HAS_SOME_SOUND_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_SEA_LEVEL_PRESSURE_FIELD, HAS_SOME_SEA_LEVEL_PRESSURE_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_PRESSURE_FIELD, HAS_SOME_PRESSURE_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_ALTITUDE_FIELD, HAS_SOME_ALTITUDE_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_INFRARED_FIELD, HAS_SOME_INFRARED_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_ULTRAVIOLET_FIELD, HAS_SOME_ULTRAVIOLET_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_VISIBILITY_FIELD, HAS_SOME_VISIBILITY_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_ROLL_FIELD, HAS_SOME_ROLL_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_PITCH_FIELD, HAS_SOME_PITCH_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_YAW_FIELD, HAS_SOME_YAW_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_ACCELERATION_FIELD, HAS_SOME_ACCELERATION_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_GYROSCOPIC_FIELD, HAS_SOME_GYROSCOPIC_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_TEMPERATURE_SENSOR_ID_FIELD, HAS_ID_FIELD, TEMPERATURE_SENSOR);
        ontology.addSomeValuesFromRestriction(HAS_SOME_HUMIDITY_SENSOR_ID_FIELD, HAS_ID_FIELD, HUMIDITY_SENSOR);
        ontology.addSomeValuesFromRestriction(HAS_SOME_VIBRATION_SENSOR_ID_FIELD, HAS_ID_FIELD, VIBRATION_SENSOR);
        ontology.addSomeValuesFromRestriction(HAS_SOME_MAGNETIC_FIELD_SENSOR_ID_FIELD, HAS_ID_FIELD, MAGNETIC_FIELD_SENSOR);
        ontology.addSomeValuesFromRestriction(HAS_SOME_OPTICAL_INTERRUPTION_SENSOR_ID_FIELD, HAS_ID_FIELD, OPTICAL_INTERRUPTION_SENSOR);
        ontology.addSomeValuesFromRestriction(HAS_SOME_TILT_SENSOR_ID_FIELD, HAS_ID_FIELD, TILT_SENSOR);
        ontology.addSomeValuesFromRestriction(HAS_SOME_FLAME_SENSOR_ID_FIELD, HAS_ID_FIELD, FLAME_SENSOR);
        ontology.addSomeValuesFromRestriction(HAS_SOME_OBSTACLE_SENSOR_ID_FIELD, HAS_ID_FIELD, OBSTACLE_SENSOR);
        ontology.addSomeValuesFromRestriction(HAS_SOME_TRACKING_SENSOR_ID_FIELD, HAS_ID_FIELD, TRACKING_SENSOR);
        ontology.addSomeValuesFromRestriction(HAS_SOME_METAL_TOUCH_SENSOR_ID_FIELD, HAS_ID_FIELD, METAL_TOUCH_SENSOR);
        ontology.addSomeValuesFromRestriction(HAS_SOME_SOUND_SENSOR_ID_FIELD, HAS_ID_FIELD, SOUND_SENSOR);
        ontology.addSomeValuesFromRestriction(HAS_SOME_SEA_LEVEL_PRESSURE_SENSOR_ID_FIELD, HAS_ID_FIELD, SEA_LEVEL_PRESSURE_SENSOR);
        ontology.addSomeValuesFromRestriction(HAS_SOME_PRESSURE_SENSOR_ID_FIELD, HAS_ID_FIELD, PRESSURE_SENSOR);
        ontology.addSomeValuesFromRestriction(HAS_SOME_ALTITUDE_SENSOR_ID_FIELD, HAS_ID_FIELD, ALTITUDE_SENSOR);
        ontology.addSomeValuesFromRestriction(HAS_SOME_INFRARED_SENSOR_ID_FIELD, HAS_ID_FIELD, INFRARED_SENSOR);
        ontology.addSomeValuesFromRestriction(HAS_SOME_ULTRAVIOLET_SENSOR_ID_FIELD, HAS_FIELD, ULTRAVIOLET_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_VISIBILITY_SENSOR_ID_FIELD, HAS_FIELD, VISIBILITY_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_ROLL_SENSOR_ID_FIELD, HAS_FIELD, ROLL_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_PITCH_SENSOR_ID_FIELD, HAS_FIELD, PITCH_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_YAW_SENSOR_ID_FIELD, HAS_FIELD, YAW_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_ACCELERATION_SENSOR_ID_FIELD, HAS_FIELD, ACCELERATION_FIELD);
        ontology.addSomeValuesFromRestriction(HAS_SOME_GYROSCOPIC_SENSOR_ID_FIELD, HAS_FIELD, GYROSCOPIC_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_TEMPERATURE_SENSOR_ID, HAS_SOME_TEMPERATURE_SENSOR_ID_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_HUMIDITY_SENSOR_ID, HAS_SOME_HUMIDITY_SENSOR_ID_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_VIBRATION_SENSOR_ID, HAS_SOME_VIBRATION_SENSOR_ID_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_MAGNETIC_FIELD_SENSOR_ID, HAS_SOME_MAGNETIC_FIELD_SENSOR_ID_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_OPTICAL_INTERRUPTION_SENSOR_ID, HAS_SOME_OPTICAL_INTERRUPTION_SENSOR_ID_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_TILT_SENSOR_ID, HAS_SOME_TILT_SENSOR_ID_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_FLAME_SENSOR_ID, HAS_SOME_FLAME_SENSOR_ID_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_OBSTACLE_SENSOR_ID, HAS_SOME_OBSTACLE_SENSOR_ID_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_TRACKING_SENSOR_ID, HAS_SOME_TRACKING_SENSOR_ID_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_METAL_TOUCH_SENSOR_ID, HAS_SOME_METAL_TOUCH_SENSOR_ID_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_SOUND_SENSOR_ID, HAS_SOME_SOUND_SENSOR_ID_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_SEA_LEVEL_PRESSURE_SENSOR_ID, HAS_SOME_SEA_LEVEL_PRESSURE_SENSOR_ID_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_PRESSURE_SENSOR_ID, HAS_SOME_PRESSURE_SENSOR_ID_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_ALTITUDE_SENSOR_ID, HAS_SOME_ALTITUDE_SENSOR_ID_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_INFRARED_SENSOR_ID, HAS_SOME_INFRARED_SENSOR_ID_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_ULTRAVIOLET_SENSOR_ID, HAS_SOME_ULTRAVIOLET_SENSOR_ID_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_VISIBILITY_SENSOR_ID, HAS_SOME_VISIBILITY_SENSOR_ID_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_ROLL_SENSOR_ID, HAS_SOME_ROLL_SENSOR_ID_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_PITCH_SENSOR_ID, HAS_SOME_PITCH_SENSOR_ID_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_YAW_SENSOR_ID, HAS_SOME_YAW_SENSOR_ID_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_ACCELERATION_SENSOR_ID, HAS_SOME_ACCELERATION_SENSOR_ID_FIELD);
        ontology.addRestrictionEquivalentClass(DATA_WITH_GYROSCOPIC_SENSOR_ID, HAS_SOME_GYROSCOPIC_SENSOR_ID_FIELD);
    }

    @Override
    protected void addPrerequisiteDecorators(Ontology ontology) {
        new IoTOntologyDecorator(ontology);
    }
}
