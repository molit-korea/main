package pro.jeong.molithackathon2018.core.indexing;

import pro.jeong.molithackathon2018.data.indexer.IndexManager;
import java.io.File;

public class Indexer{

    public static void main(String[] ar) {
        /**
         * Args[0] : Path to Raw Data
         * Args[1] : Index by ( 0 : trip ID)
         * Args[2] : Date (given by YYYY-MM-DD)
         */
        String pathToRawData = "";
        int indexMethodInt = 0;
        IndexManager.DataSortingMethod method = null;
        String date = "";
        try {
            pathToRawData = ar[0];
            indexMethodInt = Integer.parseInt(ar[1]);
            date = ar[2];
        } catch(Exception e) {
            System.out.println("Usage : ");
            System.out.println(
                    "* Args[0] : Path to Raw Data\n" +
                    "* Args[1] : Index by ( 0 : trip ID)\n" +
                    "* Args[2] : Date (given by YYYY-MM-DD)\n"
            );
            System.exit(0);
        }

        switch(indexMethodInt) {
            case 0:
                method = IndexManager.DataSortingMethod.BY_TRIP_ID;
            case 1:
                method = IndexManager.DataSortingMethod.BY_BUS;
            case 2:
                method = IndexManager.DataSortingMethod.BY_BUS_TYPE;
            default:
                method = IndexManager.DataSortingMethod.BY_TRIP_ID;
        }

        IndexManager indexManager = new IndexManager(new File(pathToRawData), method, date);
        indexManager.startIndexing();
    }
}
