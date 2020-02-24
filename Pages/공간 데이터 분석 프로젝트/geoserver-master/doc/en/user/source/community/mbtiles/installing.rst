Installing the GeoServer MBTiles extension
==========================================

.. warning:: Make sure to match the version of the extension to the version of the GeoServer instance!


#. Download the extension from the `nightly GeoServer community module builds <https://build.geoserver.org/geoserver/master/community-latest/>`_.

    #. Download the ``mbtiles-store-plugin`` if you simply want to read MBTiles files. 
    #. Download the ``mbtiles-plugin`` if you also want to use the WMS output format generaring MBTiles and the WPS process doing the same. Make sure to install corresponding WPS extension for GeoServer instance before installing this plugin, or GeoServer won't start.

#. Extract the contents of the archive into the ``WEB-INF/lib`` directory of the GeoServer installation.
