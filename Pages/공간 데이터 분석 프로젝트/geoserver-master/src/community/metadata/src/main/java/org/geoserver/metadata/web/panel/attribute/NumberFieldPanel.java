/* (c) 2018 Open Source Geospatial Foundation - all rights reserved
 * This code is licensed under the GPL 2.0 license, available at the root
 * application directory.
 */
package org.geoserver.metadata.web.panel.attribute;

import org.apache.wicket.markup.html.form.NumberTextField;
import org.apache.wicket.markup.html.panel.Panel;
import org.apache.wicket.model.IModel;

public class NumberFieldPanel extends Panel {

    private static final long serialVersionUID = -1829729746678003578L;

    public NumberFieldPanel(String id, IModel<Integer> model) {
        super(id, model);
        add(new NumberTextField<Integer>("textfield", model, Integer.class));
    }
}
