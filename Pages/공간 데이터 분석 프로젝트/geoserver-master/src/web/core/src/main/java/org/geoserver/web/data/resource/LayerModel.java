/* (c) 2014 Open Source Geospatial Foundation - all rights reserved
 * (c) 2001 - 2013 OpenPlans
 * This code is licensed under the GPL 2.0 license, available at the root
 * application directory.
 */
package org.geoserver.web.data.resource;

import org.apache.wicket.model.IModel;
import org.geoserver.catalog.CatalogBuilder;
import org.geoserver.catalog.LayerInfo;
import org.geoserver.catalog.ResourceInfo;
import org.geoserver.web.GeoServerApplication;

/**
 * A model that serializes the layer fully, and re-attaches it to the catalog on deserialization
 *
 * @author Andrea Aime - OpenGeo
 */
@SuppressWarnings("serial")
public class LayerModel implements IModel<LayerInfo> {
    LayerInfo layerInfo;
    ResourceInfo resourceInfo;

    public LayerModel(LayerInfo layerInfo) {
        setObject(layerInfo);
    }

    @Override
    public LayerInfo getObject() {
        if (resourceInfo.getCatalog() == null) {
            new CatalogBuilder(GeoServerApplication.get().getCatalog()).attach(resourceInfo);
        }
        // preserve resourceinfo that is modification proxy
        layerInfo.setResource(resourceInfo);
        return layerInfo;
    }

    @Override
    public void setObject(LayerInfo object) {
        // workaround for dbconfig, by "dettaching" we force hibernate to reload the object
        // fully initialized with no lazy lists or proxies
        this.layerInfo = GeoServerApplication.get().getCatalog().detach((LayerInfo) object);
        this.resourceInfo =
                GeoServerApplication.get().getCatalog().detach(((LayerInfo) object).getResource());
    }

    public void detach() {
        // nothing specific to do
    }
}
