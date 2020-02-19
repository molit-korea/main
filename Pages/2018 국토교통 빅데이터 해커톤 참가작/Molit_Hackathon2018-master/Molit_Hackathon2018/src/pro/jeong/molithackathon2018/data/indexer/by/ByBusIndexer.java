package pro.jeong.molithackathon2018.data.indexer.by;
import pro.jeong.molithackathon2018.utils.Creators;
import pro.jeong.molithackathon2018.utils.Utilities;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;

public class ByBusIndexer extends ByMethodIndexer {
    private File indexOnRoot = null;

    private String targetYear = "17";
    private String targetMonth = "08";
    private String targetDay = "01";

    private String methodName = "BY_BUS";

    ArrayList<File> filesToIndex = new ArrayList<>();

    // SHARED
    private HashMap<String, ArrayList<String>> sharedAnchorMap = new HashMap<>();
    static int uniqueAnchorCounter = 0;
    //

    public ByBusIndexer(File indexOn, String[] date) {
        super();
        this.targetYear = date[0];
        this.targetMonth = date[1];
        this.targetDay = date[2];
        indexOnRoot = indexOn;

        System.out.println("Indexing by bus");

        filesToIndex = findTargetFiles();
        checkIndexFolder();
    }

    @Override
    ArrayList<File> findTargetFiles() {
        ArrayList<File> retArr = new ArrayList<>();
        try {
            ArrayList<String> targetFileStrings = Utilities.listEndPointDirectories(indexOnRoot + this.targetYear + "/" + this.targetDay);
            for(String filePath : targetFileStrings) {
                retArr.add(new File(filePath));
            }
        } catch(Exception e) {
            e.printStackTrace();
        }
        return retArr;
    }

    @Override
    void checkIndexFolder() {
        if(!new File(indexOutputRoot + methodName).exists()) {
            new File(indexOutputRoot + methodName).mkdir();
        }
    }

    private void sequentialIndexing() {
        for(int i =0; i < filesToIndex.size(); i++) {
            SequentialTask task = new SequentialTask(filesToIndex.get(i));
            task.work();
        }
    }

    public void startIndexing() {
        System.out.println("Starting indexing on root directory : " + indexOnRoot);
        sequentialIndexing();
    }

    class SequentialTask {
        File workOnFile = null;
        ArrayList<String> fileOnMemeory = new ArrayList<>();
        Object[] fileOnMemoryPrimitive = null;

        SequentialTask(File workOnFile) {
            this.workOnFile = workOnFile;
        }

        private void work() {
            loadFileOnMemory();
            System.out.println("======================================= Working on File : " + workOnFile.getName() +
                    " =======================================");

            int lineCount = 0;
            int newAnchorCount = 0;
            HashMap<String, ArrayList<String>> individualAnchorMap = new HashMap<>();

            for(int i = 0; i < fileOnMemoryPrimitive.length; i++) {
                String itemToLookUp = (String)fileOnMemoryPrimitive[i];
                String filePath = workOnFile.getAbsolutePath();

                if(!individualAnchorMap.containsKey(itemToLookUp)) { // If an individual hashmap does not contain this busID.
                    String itemToAppend = itemToLookUp;

                    ArrayList<String> initArrayList = new ArrayList<>();
                    initArrayList.add(filePath + "|" + lineCount);

                    individualAnchorMap.put(itemToAppend, initArrayList);

                    lineCount++;
                    newAnchorCount++;
                } else {
                    lineCount++;
                }

                if(lineCount % 1000000 == 0) {
                    System.out.println("File : " + workOnFile.getName() + "  New Bus Count : " + newAnchorCount +  "  Completion : ~about " + lineCount / 100000 + "%");
                }
            }
            saveIndividualFile(individualAnchorMap);
        }

        private void loadFileOnMemory() {
            BufferedReader reader = Creators.createBufferedReader(workOnFile.getAbsolutePath(), "UTF-8");
            String line = "";
            try {
                while((line = reader.readLine()) != null) {
                    String[] split = line.split("\\|");
                    String anchor = split[5];
                    fileOnMemeory.add(anchor);
                }
                fileOnMemoryPrimitive = fileOnMemeory.toArray();
                reader.close();
                System.out.println("File : " + workOnFile.getName() + " Loading Complete");
            } catch(IOException e) {
                e.printStackTrace();
            }
        }

        private void saveIndividualFile(HashMap<String, ArrayList<String>> individualAnchor) {
            BufferedWriter writer = null;
            try {
                writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(new File(
                        indexOutputRoot + methodName + "/" + targetYear + "/" + targetMonth + targetDay + "/" + workOnFile.getName() + ".csv"))));
                Object[] keyArray = individualAnchor.keySet().toArray();
                for(int i = 0; i < keyArray.length; i++) {
                    writer.write(keyArray[i] + ",");
                    for(int k = 0; k < individualAnchor.get(keyArray[i]).size(); k++) {
                        Object[] split = individualAnchor.get(keyArray[i]).get(k).split("\\|");
                        writer.write(split[0] + "," + split[1]);
                    }
                    writer.write("\n");
                }
                writer.close();
            } catch(IOException e) {

            }
        }
    }
}
