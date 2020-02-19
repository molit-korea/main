package pro.jeong.molithackathon2018.test;

import pro.jeong.molithackathon2018.core.tripVisualizer.Visualizer;
import pro.jeong.molithackathon2018.data.datatype.Bus;
import pro.jeong.molithackathon2018.data.parser.BusParserI;

public class VisualizerTest {
    public static void main(String[] ar) {
        Bus bus = new BusParserI("F:/TESTSITE/Index/", "J:/BusData", "C2780509217080115460000", "2017-08-01").getBus();
        Visualizer visualizer = new Visualizer(bus);
        visualizer.visualizeBus();
    }
}
