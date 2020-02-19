package pro.jeong.molithackathon2018.test;

import pro.jeong.molithackathon2018.data.datatype.Bus;
import pro.jeong.molithackathon2018.data.parser.BusParserI;
import pro.jeong.molithackathon2018.data.parser.TripIDRetriever;

import java.util.ArrayList;

public class DecryptBusData {
    /**
     * C-130225277417080309110000
     * C-186603637317080317390000
     * C2783370517080308130000
     * C-186597025717080310120000
     * C184683059817080305330000
     * C-141667501117080308420000
     * C-21613060517080400000000
     * C-200933315917080307023300
     * C22803405717080306571600
     * C22818499617080306531700
     * C-203777584717080319120000
     * C-186597115717080322100000
     * C22815334417080307211900
     * C-15059655217080305584500
     * C22809552517080400000000
     */

    public static void main(String[] ar) {
        BusParserI parser = new BusParserI("F:/TESTSITE/Index/", "J:/BusData", "C22803405717080306571600", "2017-08-03");
        TripIDRetriever idRetriever = new TripIDRetriever("F:/TESTSITE/Index/", "2017-08-03");
        ArrayList<String> tripIDs = idRetriever.getTripIDs();
        for(int i = 0; i < tripIDs.size(); i++) {
            System.out.println(tripIDs.get(i));
        }

        Thread pThread = new Thread(parser);
        pThread.start();
        try {
            pThread.join();
        } catch(InterruptedException e) {
            e.printStackTrace();
        }

        Bus bus = parser.getBus();

        System.out.println("Bus ID : " + bus.getBusID());
        System.out.println("Bus Type : " + bus.getBusType());
        System.out.println("Company ID : " + bus.getCompanyID());
        System.out.println("Region ID : " + bus.getRunningRegion());
        System.out.println("Bus Number_01 : " + bus.getBusNumber_01());
        System.out.println("Driver ID : " + bus.getDriverID());
        System.out.println("Recorder Model : " + bus.getRecorederModel());
        System.out.println("Daily Drive Length : " + bus.getDayDriveLength());
    }
}
