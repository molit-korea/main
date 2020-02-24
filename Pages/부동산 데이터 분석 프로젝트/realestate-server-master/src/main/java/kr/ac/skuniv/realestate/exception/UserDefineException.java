package kr.ac.skuniv.realestate.exception;

import lombok.Getter;

@Getter
public class UserDefineException extends RuntimeException {

    String originalErrorMessage;
    String errorMethod;

    public UserDefineException(String message) {
        super(message);
    }

    public UserDefineException(String message, String originalMessage) {
        super(message);
        this.originalErrorMessage = originalMessage;
    }

    public UserDefineException(String message, String originalErrorMessage, String errorMethod) {
        super(message);
        this.originalErrorMessage = originalErrorMessage;
        this.errorMethod = errorMethod;
    }
}