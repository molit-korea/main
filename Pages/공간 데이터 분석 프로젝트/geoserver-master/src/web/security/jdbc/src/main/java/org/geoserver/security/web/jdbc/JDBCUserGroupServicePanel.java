/* (c) 2014 Open Source Geospatial Foundation - all rights reserved
 * (c) 2001 - 2013 OpenPlans
 * This code is licensed under the GPL 2.0 license, available at the root
 * application directory.
 */
package org.geoserver.security.web.jdbc;

import org.apache.wicket.markup.html.form.CheckBox;
import org.apache.wicket.markup.html.form.TextField;
import org.apache.wicket.model.IModel;
import org.geoserver.security.jdbc.JDBCUserGroupService;
import org.geoserver.security.jdbc.config.JDBCUserGroupServiceConfig;
import org.geoserver.security.web.usergroup.UserGroupServicePanel;

/**
 * Configuration panel for {@link JDBCUserGroupService}.
 *
 * @author Justin Deoliveira, OpenGeo
 */
public class JDBCUserGroupServicePanel extends UserGroupServicePanel<JDBCUserGroupServiceConfig> {

    public JDBCUserGroupServicePanel(String id, IModel<JDBCUserGroupServiceConfig> model) {
        super(id, model);

        add(new JDBCConnectionPanel("cx", model));
        add(new CheckBox("creatingTables"));
        add(new TextField("propertyFileNameDDL"));
        add(new TextField("propertyFileNameDML"));
    }
}
