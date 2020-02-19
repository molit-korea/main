package pro.jeong.molithackathon2018.frags;

import java.io.*;
import java.util.ArrayList;

public class DatasetRearranger {
    DatasetRearranger() {

    }

    private void bringAlldataToOneFolder(String originalDataPath, String targetDestinationPath) {
        File originalDirectory = new File(originalDataPath);
        if(!originalDirectory.isDirectory()) {
            System.out.println("Not a directory");
        } else {
            String[] tmpDirectoryListing = originalDirectory.list();
            for(int i = 0; i < tmpDirectoryListing.length; i++) {
                tmpDirectoryListing[i] = originalDataPath + tmpDirectoryListing[i];
            }
            ArrayList<String> validDirectories = sortDirectoriesOnly(tmpDirectoryListing);

            int numbering = 0;
            for(String dirName : validDirectories) {
                copyToTargetDestination(dirName, targetDestinationPath, numbering);
                numbering ++;
            }
        }
    }

    private ArrayList<String> sortDirectoriesOnly(String[] wholeListing) {
        ArrayList<String> retArray = new ArrayList<>();
        for(int i = 0; i < wholeListing.length; i++) {
            if(new File(wholeListing[i]).isDirectory()) {
                retArray.add(wholeListing[i]);
            }
        }
        return retArray;
    }

    private void copyToTargetDestination(String parentPath, String targetDestinationPath, int numbering) {
        checkAndCreateTargetDestinationFolder(targetDestinationPath);
        String filename = new File(parentPath).list()[0];
        File file = new File(parentPath + "/" + filename);
        System.out.println("Copying : " + parentPath + "/" + filename);

        BufferedReader reader = null;
        BufferedWriter writer = null;
        try {
            reader = new BufferedReader(new InputStreamReader(new FileInputStream(file), "UTF-8"));
            writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(new File(targetDestinationPath + String.valueOf(numbering) + "_" + file.getName())), "UTF-8"));

            String line = "";
            int counter = 0;
            while((line = reader.readLine()) != null) {
                writer.write(line + "\n");
                if(counter % 100000 == 0) {
                    System.out.println(line);
                }
                counter++;
                writer.flush();
            }
            writer.close();
        } catch(IOException e) {

        }
    }

    private void checkAndCreateTargetDestinationFolder(String targetDestinationpath) {
        if(!new File(targetDestinationpath).exists()) {
            new File(targetDestinationpath).mkdir();
        }
    }

    public static void main(String[] ar) {
        DatasetRearranger rearranger = new DatasetRearranger();
        rearranger.bringAlldataToOneFolder("J:/1/", "J:/Datasets/");
    }
}
