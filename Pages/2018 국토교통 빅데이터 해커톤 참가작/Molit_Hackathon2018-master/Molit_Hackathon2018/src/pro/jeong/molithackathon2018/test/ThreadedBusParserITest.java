package pro.jeong.molithackathon2018.test;

import pro.jeong.molithackathon2018.core.tripVisualizer.Visualizer;
import pro.jeong.molithackathon2018.data.datatype.Bus;
import pro.jeong.molithackathon2018.data.parser.BusParserI;
import pro.jeong.molithackathon2018.data.parser.TripIDRetriever;

import java.util.ArrayList;

public class ThreadedBusParserITest {
    public static void main(String[] ar) {
        long start = System.currentTimeMillis();

        ArrayList<String> tripIDs = new ArrayList<String>();
        ArrayList<BusParserI> parsers = new ArrayList<>();
        ArrayList<Thread> parserThreads = new ArrayList<>();
        ArrayList<Bus> buses = new ArrayList<>();

        TripIDRetriever tripIDRetriever = new TripIDRetriever("F:/TESTSITE/Index/", "2017-08-03");
        tripIDs = tripIDRetriever.getTripIDs();

        int count = 0;
        for(int i = 10800; i < 10830; i++) {
            parsers.add(new BusParserI("F:/TESTSITE/Index/", "J:/BusData/", tripIDs.get(i), "2017-08-03"));
            parserThreads.add(new Thread(parsers.get(count)));
            count++;
        }

        for(int i = 0; i < parserThreads.size(); i++) {
            parserThreads.get(i).start();
            System.out.println(parserThreads.get(i).getName() + " Started");
        }

        try {
            for (int i = 0; i < parserThreads.size(); i++) {
                parserThreads.get(i).join();
            }
        } catch(InterruptedException e) {
            e.printStackTrace();
        }


        for(int i = 0; i < parserThreads.size(); i++) {
            buses.add(parsers.get(i).getBus());
        }

        long middle = System.currentTimeMillis();

        ArrayList<Visualizer> visualizers = new ArrayList<>();
        for(int i = 0; i < buses.size(); i++) {
            Visualizer tripVisualizer = new Visualizer(buses.get(i));
            visualizers.add(tripVisualizer);
        }

        for(int i = 0; i < visualizers.size(); i++) {
            visualizers.get(i).visualizeBus();
        }

        System.out.println("Job took " + ((middle - start) / 1000) + " seconds to process and retrieve buses\n" +
                           "Took " + ((System.currentTimeMillis() - middle) / 1000) + " seconds to visualize trips\n" +
                           "On  " + count + "  Trips");
    }
}
