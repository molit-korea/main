package pro.jeong.molithackathon2018.core.dataserver;

import java.io.File;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.SocketAddress;

public class DataServer {
    File dataArchiveDirectory = null;
    ServerSocket serverSocket = null;


    public DataServer(String dataArchivePath) {
        this.dataArchiveDirectory = new File(dataArchivePath);
        if(!dataArchiveDirectory.exists()) {
            dataArchiveDirectory.mkdir();
        }
    }

    private void setServerSocket() {
        try {
            serverSocket = new ServerSocket();
        } catch(IOException e) {

        }

    }
}
