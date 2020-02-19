# ruby maven #

this is a ruby wrapper around [maven-3.3.x](http://maven.apache.org)
and comes with the ruby DSL from
[Polyglot Maven](https://github.com/takari/polyglot-maven)
preconfigured.

## command line ###

just execute it with ```rmvn``` or

```
$ rmvn --version
Polyglot Maven Extension 0.1.13
Apache Maven 3.3.3 (7994120775791599e205a5524ec3e0dfe41d4a06; 2015-04-22T13:57:37+02:00)
Maven home: /usr/local/lib/ruby/gems/2.2.0/gems/ruby-maven-libs-3.3.3/maven-home
Java version: 1.8.0_51, vendor: Oracle Corporation
Java home: /Library/Java/JavaVirtualMachines/jdk1.8.0_51.jdk/Contents/Home/jre
Default locale: en_US, platform encoding: UTF-8
OS name: "mac os x", version: "10.10.5", arch: "x86_64", family: "mac"
```

## using it from ruby ##

```
require 'ruby-maven'

RubyMaven.exec( '--version' )
```

this will run the same maven as the above command execution.

## Mavenfile, pom.rb and pom.xml ##

the polyglot maven part will look for either of those files

* Mavenfile
* pom.rb
* pom.xml

in this order. the first two are ruby files using a ruby DSL for POM.

best see these files for a more examples on this ruby DSL

* [maven style](https://github.com/torquebox/maven-tools/blob/master/spec/pom_maven_style/pom.rb) - almost like the original pom.xml with nested blocks
* [hash style](https://github.com/torquebox/maven-tools/blob/master/spec/pom_maven_hash_style/pom.rb)
* [some alternatives](https://github.com/torquebox/maven-tools/blob/master/spec/pom_maven_alternative_style/pom.rb)

all three examples are equivalent to
[pom.xml](https://github.com/torquebox/maven-tools/blob/master/spec/pom.xml).

Mavenfile and pom.rb are the same thing, one is closer to ruby and the
other is closer to maven in its naming.

## license ##

it is licensed under (EPL-1.0)[https://www.eclipse.org/legal/epl-v10.html]

## contributing #

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

# meta-fu #

enjoy :) 


