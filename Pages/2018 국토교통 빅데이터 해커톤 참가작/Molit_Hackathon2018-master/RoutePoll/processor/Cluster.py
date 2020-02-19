from Coordinate import Coordinate


class Cluster:
    mainCluster: bool
    front: bool
    occupied: bool

    clusterID: int
    headedto: int

    claims: int

    centerCoordinate: Coordinate
    busStopCoordinate: Coordinate

    coordinates = [Coordinate]

    def __init__(self, clusterID: int, clusterCenterLat, clusterCenterLng):
        center = Coordinate(clusterCenterLat, clusterCenterLng)
        self.centerCoordinate = center
        self.clusterID = clusterID
        self.occupied = False
        self.headedto = -1

        print("Cluster", self.clusterID, "created with latitude : ", self.centerCoordinate.latitude, "  longitude : ", self.centerCoordinate.longitude)

    def getCenterLat(self):
        return self.centerCoordinate.latitude

    def getCenterLng(self):
        return self.centerCoordinate.longitude

    def getClusterID(self):
        return self.clusterID

    def isMainCluster(self):
        return self.mainCluster

    def isHeadedTo(self):
        return self.headedto

    def isOccupied(self):
        return self.occupied