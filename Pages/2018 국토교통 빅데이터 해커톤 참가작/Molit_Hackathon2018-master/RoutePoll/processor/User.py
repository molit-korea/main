from Coordinate import Coordinate

class User:
    userID : int

    frontCoordinate: Coordinate
    endCoordinate: Coordinate

    def __init__(self, frontCoordinate, endCoordinate, userID):
        self.userID = userID

        self.frontCoordinate = frontCoordinate
        self.endCoordinate = endCoordinate