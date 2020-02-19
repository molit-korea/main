# Welcome to filebeat 5.5.2

Filebeat sends log files to Logstash or directly to Elasticsearch.

## Getting Started

To get started with filebeat, you need to set up Elasticsearch on your localhost first. After that, start filebeat with:

     ./filebeat  -c filebeat.yml -e

This will start the beat and send the data to your Elasticsearch instance. To load the dashboards for filebeat into Kibana, run:

    ./scripts/import_dashboards

For further steps visit the [Getting started](https://www.elastic.co/guide/en/beats/filebeat/5.5/filebeat-getting-started.html) guide.

## Documentation

Visit [Elastic.co Docs](https://www.elastic.co/guide/en/beats/filebeat/5.5/index.html) for the full filebeat documentation.

## Release notes

https://www.elastic.co/guide/en/beats/libbeat/5.5/release-notes-5.5.2.html
