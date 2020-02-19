package pro.jeong.molithackathon2018.test;

import pro.jeong.molithackathon2018.core.tripVisualizer.Visualizer;
import pro.jeong.molithackathon2018.data.datatype.Bus;
import pro.jeong.molithackathon2018.data.parser.BusParserI;

public class BusParserITest {
    /**
     * C-130225277417080309110000
     * C-186603637317080317390000
     * C2783370517080308130000
     * C-186597025717080310120000
     * C184683059817080305330000
     * C-141667501117080308420000
     * C-21613060517080400000000
     */
    public static void main(String[] ar) {
        BusParserI parser = new BusParserI("F:/TESTSITE/Index/", "J:/BusData", "C-21613060517080400000000", "2017-08-03");
        Thread pThread = new Thread(parser);
        pThread.start();
        try {
            pThread.wait();
        } catch(InterruptedException e) {
            e.printStackTrace();
        }

        Bus bus = parser.getBus();
        System.out.println(bus.getBusType());

        Visualizer visualizer = new Visualizer(bus);
        visualizer.visualizeBus();
    }
}
