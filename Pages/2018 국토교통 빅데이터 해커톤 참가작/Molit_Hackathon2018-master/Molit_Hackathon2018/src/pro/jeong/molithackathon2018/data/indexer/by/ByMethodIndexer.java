package pro.jeong.molithackathon2018.data.indexer.by;

import pro.jeong.molithackathon2018.utils.Creators;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;

public abstract class ByMethodIndexer{
    protected final int BusIDColumn = 5;
    protected final int TripIDColumn = 0;

    String indexOutputRoot = "Index/";
    String indexingMethod = "";

    ByMethodIndexer() {

    }

    abstract ArrayList<File> findTargetFiles();
    abstract void checkIndexFolder();
}
