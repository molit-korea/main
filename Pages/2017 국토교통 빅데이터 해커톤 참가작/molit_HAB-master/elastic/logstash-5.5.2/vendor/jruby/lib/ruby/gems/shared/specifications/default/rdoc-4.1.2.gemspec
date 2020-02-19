# -*- encoding: utf-8 -*-
# stub: rdoc 4.1.2 ruby lib

Gem::Specification.new do |s|
  s.name = "rdoc"
  s.version = "4.1.2"

  s.required_rubygems_version = Gem::Requirement.new(">= 1.3") if s.respond_to? :required_rubygems_version=
  s.authors = ["Eric Hodel", "Dave Thomas", "Phil Hagelberg", "Tony Strauss"]
  s.date = "2014-09-10"
  s.description = "RDoc produces HTML and command-line documentation for Ruby projects.  RDoc\nincludes the +rdoc+ and +ri+ tools for generating and displaying documentation\nfrom the command-line."
  s.email = ["drbrain@segment7.net", "", "technomancy@gmail.com", "tony.strauss@designingpatterns.com"]
  s.executables = ["rdoc", "ri"]
  s.extra_rdoc_files = ["CONTRIBUTING.rdoc", "CVE-2013-0256.rdoc", "ExampleMarkdown.md", "ExampleRDoc.rdoc", "History.rdoc", "LEGAL.rdoc", "LICENSE.rdoc", "Manifest.txt", "README.rdoc", "RI.rdoc", "TODO.rdoc", "Rakefile"]
  s.files = [".autotest", ".document", ".gemtest", "CONTRIBUTING.rdoc", "CVE-2013-0256.rdoc", "ExampleMarkdown.md", "ExampleRDoc.rdoc", "History.rdoc", "LEGAL.rdoc", "LICENSE.rdoc", "Manifest.txt", "README.rdoc", "RI.rdoc", "Rakefile", "TODO.rdoc", "bin/rdoc", "bin/ri", "lib/gauntlet_rdoc.rb", "lib/rdoc.rb", "lib/rdoc/alias.rb", "lib/rdoc/anon_class.rb", "lib/rdoc/any_method.rb", "lib/rdoc/attr.rb", "lib/rdoc/class_module.rb", "lib/rdoc/code_object.rb", "lib/rdoc/code_objects.rb", "lib/rdoc/comment.rb", "lib/rdoc/constant.rb", "lib/rdoc/context.rb", "lib/rdoc/context/section.rb", "lib/rdoc/cross_reference.rb", "lib/rdoc/encoding.rb", "lib/rdoc/erb_partial.rb", "lib/rdoc/erbio.rb", "lib/rdoc/extend.rb", "lib/rdoc/generator.rb", "lib/rdoc/generator/darkfish.rb", "lib/rdoc/generator/json_index.rb", "lib/rdoc/generator/markup.rb", "lib/rdoc/generator/ri.rb", "lib/rdoc/generator/template/darkfish/.document", "lib/rdoc/generator/template/darkfish/_footer.rhtml", "lib/rdoc/generator/template/darkfish/_head.rhtml", "lib/rdoc/generator/template/darkfish/_sidebar_VCS_info.rhtml", "lib/rdoc/generator/template/darkfish/_sidebar_classes.rhtml", "lib/rdoc/generator/template/darkfish/_sidebar_extends.rhtml", "lib/rdoc/generator/template/darkfish/_sidebar_in_files.rhtml", "lib/rdoc/generator/template/darkfish/_sidebar_includes.rhtml", "lib/rdoc/generator/template/darkfish/_sidebar_installed.rhtml", "lib/rdoc/generator/template/darkfish/_sidebar_methods.rhtml", "lib/rdoc/generator/template/darkfish/_sidebar_navigation.rhtml", "lib/rdoc/generator/template/darkfish/_sidebar_pages.rhtml", "lib/rdoc/generator/template/darkfish/_sidebar_parent.rhtml", "lib/rdoc/generator/template/darkfish/_sidebar_search.rhtml", "lib/rdoc/generator/template/darkfish/_sidebar_sections.rhtml", "lib/rdoc/generator/template/darkfish/_sidebar_table_of_contents.rhtml", "lib/rdoc/generator/template/darkfish/class.rhtml", "lib/rdoc/generator/template/darkfish/fonts.css", "lib/rdoc/generator/template/darkfish/fonts/Lato-Light.ttf", "lib/rdoc/generator/template/darkfish/fonts/Lato-LightItalic.ttf", "lib/rdoc/generator/template/darkfish/fonts/Lato-Regular.ttf", "lib/rdoc/generator/template/darkfish/fonts/Lato-RegularItalic.ttf", "lib/rdoc/generator/template/darkfish/fonts/SourceCodePro-Bold.ttf", "lib/rdoc/generator/template/darkfish/fonts/SourceCodePro-Regular.ttf", "lib/rdoc/generator/template/darkfish/images/add.png", "lib/rdoc/generator/template/darkfish/images/arrow_up.png", "lib/rdoc/generator/template/darkfish/images/brick.png", "lib/rdoc/generator/template/darkfish/images/brick_link.png", "lib/rdoc/generator/template/darkfish/images/bug.png", "lib/rdoc/generator/template/darkfish/images/bullet_black.png", "lib/rdoc/generator/template/darkfish/images/bullet_toggle_minus.png", "lib/rdoc/generator/template/darkfish/images/bullet_toggle_plus.png", "lib/rdoc/generator/template/darkfish/images/date.png", "lib/rdoc/generator/template/darkfish/images/delete.png", "lib/rdoc/generator/template/darkfish/images/find.png", "lib/rdoc/generator/template/darkfish/images/loadingAnimation.gif", "lib/rdoc/generator/template/darkfish/images/macFFBgHack.png", "lib/rdoc/generator/template/darkfish/images/package.png", "lib/rdoc/generator/template/darkfish/images/page_green.png", "lib/rdoc/generator/template/darkfish/images/page_white_text.png", "lib/rdoc/generator/template/darkfish/images/page_white_width.png", "lib/rdoc/generator/template/darkfish/images/plugin.png", "lib/rdoc/generator/template/darkfish/images/ruby.png", "lib/rdoc/generator/template/darkfish/images/tag_blue.png", "lib/rdoc/generator/template/darkfish/images/tag_green.png", "lib/rdoc/generator/template/darkfish/images/transparent.png", "lib/rdoc/generator/template/darkfish/images/wrench.png", "lib/rdoc/generator/template/darkfish/images/wrench_orange.png", "lib/rdoc/generator/template/darkfish/images/zoom.png", "lib/rdoc/generator/template/darkfish/index.rhtml", "lib/rdoc/generator/template/darkfish/js/darkfish.js", "lib/rdoc/generator/template/darkfish/js/jquery.js", "lib/rdoc/generator/template/darkfish/js/search.js", "lib/rdoc/generator/template/darkfish/page.rhtml", "lib/rdoc/generator/template/darkfish/rdoc.css", "lib/rdoc/generator/template/darkfish/servlet_not_found.rhtml", "lib/rdoc/generator/template/darkfish/servlet_root.rhtml", "lib/rdoc/generator/template/darkfish/table_of_contents.rhtml", "lib/rdoc/generator/template/json_index/.document", "lib/rdoc/generator/template/json_index/js/navigation.js", "lib/rdoc/generator/template/json_index/js/searcher.js", "lib/rdoc/ghost_method.rb", "lib/rdoc/include.rb", "lib/rdoc/known_classes.rb", "lib/rdoc/markdown.kpeg", "lib/rdoc/markdown.rb", "lib/rdoc/markdown/entities.rb", "lib/rdoc/markdown/literals_1_8.kpeg", "lib/rdoc/markdown/literals_1_8.rb", "lib/rdoc/markdown/literals_1_9.kpeg", "lib/rdoc/markdown/literals_1_9.rb", "lib/rdoc/markup.rb", "lib/rdoc/markup/attr_changer.rb", "lib/rdoc/markup/attr_span.rb", "lib/rdoc/markup/attribute_manager.rb", "lib/rdoc/markup/attributes.rb", "lib/rdoc/markup/blank_line.rb", "lib/rdoc/markup/block_quote.rb", "lib/rdoc/markup/document.rb", "lib/rdoc/markup/formatter.rb", "lib/rdoc/markup/formatter_test_case.rb", "lib/rdoc/markup/hard_break.rb", "lib/rdoc/markup/heading.rb", "lib/rdoc/markup/include.rb", "lib/rdoc/markup/indented_paragraph.rb", "lib/rdoc/markup/inline.rb", "lib/rdoc/markup/list.rb", "lib/rdoc/markup/list_item.rb", "lib/rdoc/markup/paragraph.rb", "lib/rdoc/markup/parser.rb", "lib/rdoc/markup/pre_process.rb", "lib/rdoc/markup/raw.rb", "lib/rdoc/markup/rule.rb", "lib/rdoc/markup/special.rb", "lib/rdoc/markup/text_formatter_test_case.rb", "lib/rdoc/markup/to_ansi.rb", "lib/rdoc/markup/to_bs.rb", "lib/rdoc/markup/to_html.rb", "lib/rdoc/markup/to_html_crossref.rb", "lib/rdoc/markup/to_html_snippet.rb", "lib/rdoc/markup/to_joined_paragraph.rb", "lib/rdoc/markup/to_label.rb", "lib/rdoc/markup/to_markdown.rb", "lib/rdoc/markup/to_rdoc.rb", "lib/rdoc/markup/to_table_of_contents.rb", "lib/rdoc/markup/to_test.rb", "lib/rdoc/markup/to_tt_only.rb", "lib/rdoc/markup/verbatim.rb", "lib/rdoc/meta_method.rb", "lib/rdoc/method_attr.rb", "lib/rdoc/mixin.rb", "lib/rdoc/normal_class.rb", "lib/rdoc/normal_module.rb", "lib/rdoc/options.rb", "lib/rdoc/parser.rb", "lib/rdoc/parser/c.rb", "lib/rdoc/parser/changelog.rb", "lib/rdoc/parser/markdown.rb", "lib/rdoc/parser/rd.rb", "lib/rdoc/parser/ruby.rb", "lib/rdoc/parser/ruby_tools.rb", "lib/rdoc/parser/simple.rb", "lib/rdoc/parser/text.rb", "lib/rdoc/rd.rb", "lib/rdoc/rd/block_parser.rb", "lib/rdoc/rd/block_parser.ry", "lib/rdoc/rd/inline.rb", "lib/rdoc/rd/inline_parser.rb", "lib/rdoc/rd/inline_parser.ry", "lib/rdoc/rdoc.rb", "lib/rdoc/require.rb", "lib/rdoc/ri.rb", "lib/rdoc/ri/driver.rb", "lib/rdoc/ri/formatter.rb", "lib/rdoc/ri/paths.rb", "lib/rdoc/ri/store.rb", "lib/rdoc/ruby_lex.rb", "lib/rdoc/ruby_token.rb", "lib/rdoc/rubygems_hook.rb", "lib/rdoc/servlet.rb", "lib/rdoc/single_class.rb", "lib/rdoc/stats.rb", "lib/rdoc/stats/normal.rb", "lib/rdoc/stats/quiet.rb", "lib/rdoc/stats/verbose.rb", "lib/rdoc/store.rb", "lib/rdoc/task.rb", "lib/rdoc/test_case.rb", "lib/rdoc/text.rb", "lib/rdoc/token_stream.rb", "lib/rdoc/tom_doc.rb", "lib/rdoc/top_level.rb", "test/MarkdownTest_1.0.3/Amps and angle encoding.text", "test/MarkdownTest_1.0.3/Auto links.text", "test/MarkdownTest_1.0.3/Backslash escapes.text", "test/MarkdownTest_1.0.3/Blockquotes with code blocks.text", "test/MarkdownTest_1.0.3/Code Blocks.text", "test/MarkdownTest_1.0.3/Code Spans.text", "test/MarkdownTest_1.0.3/Hard-wrapped paragraphs with list-like lines.text", "test/MarkdownTest_1.0.3/Horizontal rules.text", "test/MarkdownTest_1.0.3/Inline HTML (Advanced).text", "test/MarkdownTest_1.0.3/Inline HTML (Simple).text", "test/MarkdownTest_1.0.3/Inline HTML comments.text", "test/MarkdownTest_1.0.3/Links, inline style.text", "test/MarkdownTest_1.0.3/Links, reference style.text", "test/MarkdownTest_1.0.3/Links, shortcut references.text", "test/MarkdownTest_1.0.3/Literal quotes in titles.text", "test/MarkdownTest_1.0.3/Markdown Documentation - Basics.text", "test/MarkdownTest_1.0.3/Markdown Documentation - Syntax.text", "test/MarkdownTest_1.0.3/Nested blockquotes.text", "test/MarkdownTest_1.0.3/Ordered and unordered lists.text", "test/MarkdownTest_1.0.3/Strong and em together.text", "test/MarkdownTest_1.0.3/Tabs.text", "test/MarkdownTest_1.0.3/Tidyness.text", "test/README", "test/binary.dat", "test/hidden.zip.txt", "test/test.ja.largedoc", "test/test.ja.rdoc", "test/test.ja.txt", "test/test.txt", "test/test_rdoc_alias.rb", "test/test_rdoc_any_method.rb", "test/test_rdoc_attr.rb", "test/test_rdoc_class_module.rb", "test/test_rdoc_code_object.rb", "test/test_rdoc_comment.rb", "test/test_rdoc_constant.rb", "test/test_rdoc_context.rb", "test/test_rdoc_context_section.rb", "test/test_rdoc_cross_reference.rb", "test/test_rdoc_encoding.rb", "test/test_rdoc_extend.rb", "test/test_rdoc_generator_darkfish.rb", "test/test_rdoc_generator_json_index.rb", "test/test_rdoc_generator_markup.rb", "test/test_rdoc_generator_ri.rb", "test/test_rdoc_include.rb", "test/test_rdoc_markdown.rb", "test/test_rdoc_markdown_test.rb", "test/test_rdoc_markup.rb", "test/test_rdoc_markup_attribute_manager.rb", "test/test_rdoc_markup_attributes.rb", "test/test_rdoc_markup_document.rb", "test/test_rdoc_markup_formatter.rb", "test/test_rdoc_markup_hard_break.rb", "test/test_rdoc_markup_heading.rb", "test/test_rdoc_markup_include.rb", "test/test_rdoc_markup_indented_paragraph.rb", "test/test_rdoc_markup_paragraph.rb", "test/test_rdoc_markup_parser.rb", "test/test_rdoc_markup_pre_process.rb", "test/test_rdoc_markup_raw.rb", "test/test_rdoc_markup_to_ansi.rb", "test/test_rdoc_markup_to_bs.rb", "test/test_rdoc_markup_to_html.rb", "test/test_rdoc_markup_to_html_crossref.rb", "test/test_rdoc_markup_to_html_snippet.rb", "test/test_rdoc_markup_to_joined_paragraph.rb", "test/test_rdoc_markup_to_label.rb", "test/test_rdoc_markup_to_markdown.rb", "test/test_rdoc_markup_to_rdoc.rb", "test/test_rdoc_markup_to_table_of_contents.rb", "test/test_rdoc_markup_to_tt_only.rb", "test/test_rdoc_markup_verbatim.rb", "test/test_rdoc_method_attr.rb", "test/test_rdoc_normal_class.rb", "test/test_rdoc_normal_module.rb", "test/test_rdoc_options.rb", "test/test_rdoc_parser.rb", "test/test_rdoc_parser_c.rb", "test/test_rdoc_parser_changelog.rb", "test/test_rdoc_parser_markdown.rb", "test/test_rdoc_parser_rd.rb", "test/test_rdoc_parser_ruby.rb", "test/test_rdoc_parser_simple.rb", "test/test_rdoc_rd.rb", "test/test_rdoc_rd_block_parser.rb", "test/test_rdoc_rd_inline.rb", "test/test_rdoc_rd_inline_parser.rb", "test/test_rdoc_rdoc.rb", "test/test_rdoc_require.rb", "test/test_rdoc_ri_driver.rb", "test/test_rdoc_ri_paths.rb", "test/test_rdoc_ruby_lex.rb", "test/test_rdoc_ruby_token.rb", "test/test_rdoc_rubygems_hook.rb", "test/test_rdoc_servlet.rb", "test/test_rdoc_single_class.rb", "test/test_rdoc_stats.rb", "test/test_rdoc_store.rb", "test/test_rdoc_task.rb", "test/test_rdoc_text.rb", "test/test_rdoc_token_stream.rb", "test/test_rdoc_tom_doc.rb", "test/test_rdoc_top_level.rb", "test/xref_data.rb", "test/xref_test_case.rb"]
  s.homepage = "http://docs.seattlerb.org/rdoc"
  s.licenses = ["Ruby"]
  s.post_install_message = "Depending on your version of ruby, you may need to install ruby rdoc/ri data:\n\n<= 1.8.6 : unsupported\n = 1.8.7 : gem install rdoc-data; rdoc-data --install\n = 1.9.1 : gem install rdoc-data; rdoc-data --install\n>= 1.9.2 : nothing to do! Yay!\n"
  s.rdoc_options = ["--main", "README.rdoc"]
  s.require_paths = ["lib"]
  s.required_ruby_version = Gem::Requirement.new(">= 1.8.7")
  s.rubygems_version = "2.1.9"
  s.summary = "RDoc produces HTML and command-line documentation for Ruby projects"
  s.test_files = ["test/test_rdoc_alias.rb", "test/test_rdoc_any_method.rb", "test/test_rdoc_attr.rb", "test/test_rdoc_class_module.rb", "test/test_rdoc_code_object.rb", "test/test_rdoc_comment.rb", "test/test_rdoc_constant.rb", "test/test_rdoc_context.rb", "test/test_rdoc_context_section.rb", "test/test_rdoc_cross_reference.rb", "test/test_rdoc_encoding.rb", "test/test_rdoc_extend.rb", "test/test_rdoc_generator_darkfish.rb", "test/test_rdoc_generator_json_index.rb", "test/test_rdoc_generator_markup.rb", "test/test_rdoc_generator_ri.rb", "test/test_rdoc_include.rb", "test/test_rdoc_markdown.rb", "test/test_rdoc_markdown_test.rb", "test/test_rdoc_markup.rb", "test/test_rdoc_markup_attribute_manager.rb", "test/test_rdoc_markup_attributes.rb", "test/test_rdoc_markup_document.rb", "test/test_rdoc_markup_formatter.rb", "test/test_rdoc_markup_hard_break.rb", "test/test_rdoc_markup_heading.rb", "test/test_rdoc_markup_include.rb", "test/test_rdoc_markup_indented_paragraph.rb", "test/test_rdoc_markup_paragraph.rb", "test/test_rdoc_markup_parser.rb", "test/test_rdoc_markup_pre_process.rb", "test/test_rdoc_markup_raw.rb", "test/test_rdoc_markup_to_ansi.rb", "test/test_rdoc_markup_to_bs.rb", "test/test_rdoc_markup_to_html.rb", "test/test_rdoc_markup_to_html_crossref.rb", "test/test_rdoc_markup_to_html_snippet.rb", "test/test_rdoc_markup_to_joined_paragraph.rb", "test/test_rdoc_markup_to_label.rb", "test/test_rdoc_markup_to_markdown.rb", "test/test_rdoc_markup_to_rdoc.rb", "test/test_rdoc_markup_to_table_of_contents.rb", "test/test_rdoc_markup_to_tt_only.rb", "test/test_rdoc_markup_verbatim.rb", "test/test_rdoc_method_attr.rb", "test/test_rdoc_normal_class.rb", "test/test_rdoc_normal_module.rb", "test/test_rdoc_options.rb", "test/test_rdoc_parser.rb", "test/test_rdoc_parser_c.rb", "test/test_rdoc_parser_changelog.rb", "test/test_rdoc_parser_markdown.rb", "test/test_rdoc_parser_rd.rb", "test/test_rdoc_parser_ruby.rb", "test/test_rdoc_parser_simple.rb", "test/test_rdoc_rd.rb", "test/test_rdoc_rd_block_parser.rb", "test/test_rdoc_rd_inline.rb", "test/test_rdoc_rd_inline_parser.rb", "test/test_rdoc_rdoc.rb", "test/test_rdoc_require.rb", "test/test_rdoc_ri_driver.rb", "test/test_rdoc_ri_paths.rb", "test/test_rdoc_ruby_lex.rb", "test/test_rdoc_ruby_token.rb", "test/test_rdoc_rubygems_hook.rb", "test/test_rdoc_servlet.rb", "test/test_rdoc_single_class.rb", "test/test_rdoc_stats.rb", "test/test_rdoc_store.rb", "test/test_rdoc_task.rb", "test/test_rdoc_text.rb", "test/test_rdoc_token_stream.rb", "test/test_rdoc_tom_doc.rb", "test/test_rdoc_top_level.rb"]

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<json>, ["~> 1.4"])
      s.add_development_dependency(%q<kpeg>, ["~> 0.9"])
      s.add_development_dependency(%q<minitest>, ["~> 5.4"])
      s.add_development_dependency(%q<rdoc>, ["~> 4.0"])
      s.add_development_dependency(%q<racc>, ["> 1.4.10", "~> 1.4"])
      s.add_development_dependency(%q<hoe>, ["~> 3.12"])
    else
      s.add_dependency(%q<json>, ["~> 1.4"])
      s.add_dependency(%q<kpeg>, ["~> 0.9"])
      s.add_dependency(%q<minitest>, ["~> 5.4"])
      s.add_dependency(%q<rdoc>, ["~> 4.0"])
      s.add_dependency(%q<racc>, ["> 1.4.10", "~> 1.4"])
      s.add_dependency(%q<hoe>, ["~> 3.12"])
    end
  else
    s.add_dependency(%q<json>, ["~> 1.4"])
    s.add_dependency(%q<kpeg>, ["~> 0.9"])
    s.add_dependency(%q<minitest>, ["~> 5.4"])
    s.add_dependency(%q<rdoc>, ["~> 4.0"])
    s.add_dependency(%q<racc>, ["> 1.4.10", "~> 1.4"])
    s.add_dependency(%q<hoe>, ["~> 3.12"])
  end
end
