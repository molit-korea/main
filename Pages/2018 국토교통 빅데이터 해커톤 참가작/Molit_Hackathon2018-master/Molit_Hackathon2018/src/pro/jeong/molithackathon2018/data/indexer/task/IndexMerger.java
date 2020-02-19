package pro.jeong.molithackathon2018.data.indexer.task;

import pro.jeong.molithackathon2018.utils.Creators;

import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

public class IndexMerger {
    String separateIndexContainingDirectoryToMerge = "";
    File directory = null;

    ArrayList<File> indexesToMerge = new ArrayList<>();
    String indexMethod = "";

    public IndexMerger(String separateIndexContainingDirectoryToMerge, String indexMethod) {
        this.separateIndexContainingDirectoryToMerge = separateIndexContainingDirectoryToMerge;
        this.indexMethod = indexMethod;
        setDirectory();
        loadIndexes();
    }

    private void setDirectory() {
        try {
            this.directory = new File(separateIndexContainingDirectoryToMerge);
        } catch(Exception e) {
            e.printStackTrace();
        }
    }

    private void loadIndexes() {
        for(File file : directory.listFiles()) {
            indexesToMerge.add(file);
        }
    }

    public void startMerger() {
        setSQL();

        ArrayList<String> anchorIDList = new ArrayList<>();
        HashMap<String, HashMap<String, Integer>> anchorID_fileLineMap = new HashMap<>();
        //      anchorID        filename    lines
        for(File file : indexesToMerge) {
            BufferedReader reader = Creators.createBufferedReader(file.getAbsolutePath(), "UTF-8");

            String line = "";
            System.out.println(file.getName());
            try {
                while((line = reader.readLine()) != null) {
                    String[] split = line.split(",");
                    if(!anchorIDList.contains(split[0])) {
                        anchorIDList.add(split[0]);
                        HashMap<String, Integer> initialMap = new HashMap<>();
                        initialMap.put(split[1], Integer.parseInt(split[2]));
                        anchorID_fileLineMap.put(split[0], initialMap);
                    } else {
                        anchorID_fileLineMap.get(split[0]).put(split[1], Integer.parseInt(split[2]));
                    }
                    //System.out.println("======= " + split[0] + " =======");
                    //System.out.println(anchorID_fileLineMap.get(split[0]).keySet());
                    //System.out.println(anchorID_fileLineMap.get(split[0]).get(anchorID_fileLineMap.get(split[0]).keySet().toArray()[0]));
                }
                file.delete();
            } catch(IOException e) {
                e.printStackTrace();
            }
        }

        BufferedWriter writer = null;
        try {
            writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(new File(separateIndexContainingDirectoryToMerge + "/Index.csv")), "UTF-8"));
            for(int i = 0; i < anchorIDList.size(); i++) {
                String tripID = anchorIDList.get(i);
                writer.write(tripID + ",");
                HashMap<String, Integer> mapToWrite = anchorID_fileLineMap.get(tripID);
                writer.write(mapToWrite.keySet().toArray()[0] + "," + mapToWrite.get(mapToWrite.keySet().toArray()[0]).toString());
                writer.write("\n");
                writer.flush();
            }
            writer.close();
        } catch(IOException e) {
            e.printStackTrace();
        }
    }

    private void setSQL() {
        try {
            Class.forName("org.sqlite.JDBC");
        } catch(ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    private void createDatabase() {
        try {
            Connection conn = DriverManager.getConnection(separateIndexContainingDirectoryToMerge + "/" + indexMethod + ".db");

            String statement = "CREATE TABLE IF NOT EXISTS FileIndex (";
        } catch(SQLException e) {
            e.printStackTrace();
        }
    }

    private void appendToSQLDatabase() {
        try {
            Connection conn = DriverManager.getConnection(separateIndexContainingDirectoryToMerge + "/" + indexMethod + ".db");

            String queryStatement = "INSERT OR IGNORE INTO FileIndex (filePath, line) VALUES(?,?);";
            PreparedStatement pstmt = conn.prepareStatement(queryStatement);

            //pstmt.setString(1, filePath);
            //pstmt.setInt(2, line);

            pstmt.executeUpdate();
        } catch(SQLException e) {
            e.printStackTrace();
        }
    }
}
