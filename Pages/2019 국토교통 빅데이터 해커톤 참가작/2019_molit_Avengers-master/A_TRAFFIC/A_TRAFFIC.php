<?php
require_once("inc/init.php");

require_once("../MDATA/A_Traffic_Data1.php");
?>
<?php
$chart_data1 = '';
while ($row = mysql_fetch_assoc($result)) {
    $chart_data1 .= "{ 날짜:'".$row['YMD']."', 교통량:".$row['TRAFFIC']."}, ";
}
$chart_data1 = substr($chart_data1, 0, -2);
?>
<div class="row">
	<div class="col-xs-12 col-sm-7 col-md-7 col-lg-4">
		<h1 class="page-title txt-color-blueDark">
			<i class="fa fa-send fa-fw "></i>
				구간 교통량 데이터
		</h1>
	</div>
</div>

<!-- widget grid -->
<section id="widget-grid" class="">

	<!-- row -->
	<div class="row">

		<!-- NEW WIDGET START -->
		<article class="col-xs-12 col-sm-12 col-md-12 col-lg-12">

			<!-- Widget ID (each widget will need unique ID)-->
			<div class="jarviswidget jarviswidget-color-blueLight" id="wid-id-0" data-widget-editbutton="false" data-widget-deletebutton="false">
				<!-- widget options:
				usage: <div class="jarviswidget" id="wid-id-0" data-widget-editbutton="false">

				data-widget-colorbutton="false"
				data-widget-editbutton="false"
				data-widget-togglebutton="false"
				data-widget-deletebutton="false"
				data-widget-fullscreenbutton="false"
				data-widget-custombutton="false"
				data-widget-collapsed="true"
				data-widget-sortable="false"

				-->
				<header>
					<span class="widget-icon"> <i class="fa fa-table"></i> </span>
					<h2>구간 교통량 데이터</h2>

				</header>

				<!-- widget div-->
				<div>

					<!-- widget edit box -->
					<div class="jarviswidget-editbox">
						<!-- This area used as dropdown edit box -->

					</div>
					<!-- end widget edit box -->

					<!-- widget content -->
					<div class="widget-body no-padding">

						<table id="traffic" class="table table-striped table-bordered table-hover" width="100%">
							<thead>
								<tr>
									<th data-hide="phone,tablet" style="text-align: center;">SEQ</th>
									<th style="text-align: center;">집계일자</th>
									<th style="text-align: center;">집계시간</th>
									<th style="text-align: center;">콘존ID</th>
									<th style="text-align: center;">차로ID</th>
									<th style="text-align: center;">교통량</th>
								</tr>
							</thead>
              <tfoot>
                 <tr>
                    <th style="text-align: right;"></th>
                    <th style="text-align: right;"></th>
                    <th style="text-align: right;"></th>
                    <th style="text-align: right;"></th>
                    <th style="text-align: right;"></th>
                    <th style="text-align: right;"></th>
                 </tr>
               </tfoot>
						</table>

					</div>
					<!-- end widget content -->

				</div>
				<!-- end widget div -->

			</div>
			<!-- end widget -->

		</article>
		<!-- WIDGET END -->

	</div>

	<!-- end row -->
	<!-- row -->
	<div class="row">

		<!-- NEW WIDGET START -->
		<article class="col-xs-12 col-sm-12 col-md-12 col-lg-12">

			<!-- Widget ID (each widget will need unique ID)-->
			<div class="jarviswidget jarviswidget-color-blueLight" id="wid-id-5" data-widget-editbutton="false" data-widget-deletebutton="false" data-widget-fullscreenbutton="false">
				<!-- widget options:
					usage: <div class="jarviswidget" id="wid-id-0" data-widget-editbutton="false">

					data-widget-colorbutton="false"
					data-widget-editbutton="false"
					data-widget-togglebutton="false"
					data-widget-deletebutton="false"
					data-widget-fullscreenbutton="false"
					data-widget-custombutton="false"
					data-widget-collapsed="true"
					data-widget-sortable="false"

				-->
				<header>
					<span class="widget-icon"> <i class="fa fa-bar-chart-o"></i> </span>
					<h2>2018년12월 교통량</h2>

				</header>

				<!-- widget div-->
				<div>

					<!-- widget edit box -->
					<div class="jarviswidget-editbox">
						<!-- This area used as dropdown edit box -->
						<input type="text">
					</div>
					<!-- end widget edit box -->

					<!-- widget content -->
          <div class="row no-space">

            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <!--<div id="updating-chart" class="chart-large txt-color-blue"></div> -->
              <div id="year-graph" class="chart no-padding"></div>
            </div>

          </div>
					<!-- end widget content -->

				</div>
				<!-- end widget div -->

			</div>
			<!-- end widget -->

		</article>
		<!-- WIDGET END -->

	</div>

	<!-- end row -->
  <!-- row -->
	<div class="row">

		<!-- NEW WIDGET START -->
		<article class="col-xs-12 col-sm-12 col-md-12 col-lg-12">

			<!-- Widget ID (each widget will need unique ID)-->
			<div class="jarviswidget jarviswidget-color-blueLight" id="wid-id-5" data-widget-editbutton="false" data-widget-deletebutton="false" data-widget-fullscreenbutton="false">
				<!-- widget options:
					usage: <div class="jarviswidget" id="wid-id-0" data-widget-editbutton="false">

					data-widget-colorbutton="false"
					data-widget-editbutton="false"
					data-widget-togglebutton="false"
					data-widget-deletebutton="false"
					data-widget-fullscreenbutton="false"
					data-widget-custombutton="false"
					data-widget-collapsed="true"
					data-widget-sortable="false"

				-->
				<header>
					<span class="widget-icon"> <i class="fa fa-bar-chart-o"></i> </span>
					<h2>2018년12월 교통량</h2>

				</header>

				<!-- widget div-->
				<div>

					<!-- widget edit box -->
					<div class="jarviswidget-editbox">
						<!-- This area used as dropdown edit box -->
						<input type="text">
					</div>
					<!-- end widget edit box -->

					<!-- widget content -->
          <div class="row no-space">

            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <!--<div id="updating-chart" class="chart-large txt-color-blue"></div> -->
              <div id="map" style="width:100%;height:400px;"></div>
              <script>
              var mapOptions = {
                  center: new naver.maps.LatLng(37.3595704, 127.105399),
                  zoom: 10
              };

              var map = new naver.maps.Map('map', mapOptions);
              </script>
            </div>

          </div>
					<!-- end widget content -->

				</div>
				<!-- end widget div -->

			</div>
			<!-- end widget -->

		</article>
		<!-- WIDGET END -->

	</div>

	<!-- end row -->
</section>
<!-- end widget grid -->

<script type="text/javascript">

	/* DO NOT REMOVE : GLOBAL FUNCTIONS!
	 *
	 * pageSetUp(); WILL CALL THE FOLLOWING FUNCTIONS
	 *
	 * // activate tooltips
	 * $("[rel=tooltip]").tooltip();
	 *
	 * // activate popovers
	 * $("[rel=popover]").popover();
	 *
	 * // activate popovers with hover states
	 * $("[rel=popover-hover]").popover({ trigger: "hover" });
	 *
	 * // activate inline charts
	 * runAllCharts();
	 *
	 * // setup widgets
	 * setup_widgets_desktop();
	 *
	 * // run form elements
	 * runAllForms();
	 *
	 ********************************
	 *
	 * pageSetUp() is needed whenever you load a page.
	 * It initializes and checks for all basic elements of the page
	 * and makes rendering easier.
	 *
	 */

	pageSetUp();

	/*
	 * ALL PAGE RELATED SCRIPTS CAN GO BELOW HERE
	 * eg alert("my home function");
	 *
	 * var pagefunction = function() {
	 *   ...
	 * }
	 * loadScript("js/plugin/_PLUGIN_NAME_.js", pagefunction);
	 *
	 */

	// PAGE RELATED SCRIPTS

	// pagefunction
	var pagefunction = function() {
		//console.log("cleared");

		/* // DOM Position key index //

			l - Length changing (dropdown)
			f - Filtering input (search)
			t - The Table! (datatable)
			i - Information (records)
			p - Pagination (paging)
			r - pRocessing
			< and > - div elements
			<"#id" and > - div with an id
			<"class" and > - div with a class
			<"#id.class" and > - div with an id and class

			Also see: http://legacy.datatables.net/usage/features
		*/

		/* BASIC ;*/
			var responsiveHelper_dt_basic = undefined;
			var responsiveHelper_datatable_fixed_column = undefined;
			var responsiveHelper_datatable_col_reorder = undefined;
			var responsiveHelper_datatable_tabletools = undefined;

			var breakpointDefinition = {
				tablet : 1024,
				phone : 480
			};

			$('#traffic').dataTable({
				"sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-12 hidden-xs'T>r>"+
					"t"+
					"<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
	        "oTableTools": {
	        	 "aButtons": [
	             "xls"
	             ],
	            "sSwfPath": "js/plugin/datatables/swf/copy_csv_xls_pdf.swf"
	        },

        "footerCallback": function ( row, data, start, end, display ) {
              var api = this.api(), data;

              // converting to interger to find total
              var intVal = function ( i ) {
                  return typeof i === 'string' ?
                      i.replace(/[\$,]/g, '')*1 :
                      typeof i === 'number' ?
                          i : 0;
              };
             var comma =  function (str) {
                 str = String(str);
                 return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
             };


              // computing column Total of the complete result

              var Total5 = api
                  .column( 5 )
                  .data()
                  .reduce( function (a, b) {
                      return intVal(a) + intVal(b);
                  }, 0 );

              // Update footer by showing the total with the reference of the column index
              $( api.column( 1 ).footer() ).html(' 합 계: ');
              $( api.column( 5 ).footer() ).html(comma(Total5));
          },
        "createdRow": function(row, data, index){

        if (data[5].replace(/[\$,]/g, '') * 1 > 0 ){
            $(row).find('td:eq(5)').css('background-color', '#99ffbf');
            }
        },

        "iDisplayLength": 10,
				pageLength: 10,
        "bPaginate": true,
        "bprocessing": true,
			//  "processing": true,
        "bServerSide": true,
				"bLengthChange": true,
        "scrollX": "100%",
				"autoWidth": false,
				"ordering": false,
				//searching: false,
        "ajax": "MDATA/A_Traffic_Data2.php",

        "columnDefs": [
          { className: "dt-body-center", "targets": [1,2,4] },
          { className: "dt-body-right", "targets": [0,5] },
          { className: "dt-body-nowrap", "targets": [3] }
        ],
				columns : [
						{data: "0"},
						{data: "1"},
						{data: "2"},
						{data: "3"},
						{data: "4"},
						{data: "5"}
				],
/*        "aoColumns":[
            {"mData" : 0 },
            {"mData" : 1 },
            {"mData" : 2 },
            {"mData" : 3 },
            {"mData" : 4 },
            {"mData" : 5 }
            ],

iDisplayLength: 10,
//pageLength: 3,
bPaginate: true,
bLengthChange: true,
//lengthMenu : [ [ 3, 5, 10, -1 ], [ 3, 5, 10, "All" ] ],
bAutoWidth: false,
processing: true,
ordering: false,
serverSide: true,
searching: false,
ajax : {
		"url":"MDATA/A_Traffic_Data2.php",
		"type":"POST",
		"data": function (d) {
				d.userStatCd = "NR";
		}
},
columns : [
		{data: "0"},
		{data: "1"},
		{data: "2"},
		{data: "3"},
		{data: "4"},
		{data: "5"}
],
*/
				"preDrawCallback" : function() {
					// Initialize the responsive datatables helper once.
					if (!responsiveHelper_dt_basic) {
						responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#traffic'), breakpointDefinition);
					}
				},
				"rowCallback" : function(nRow) {
					responsiveHelper_dt_basic.createExpandIcon(nRow);
				},
				"drawCallback" : function(oSettings) {
					responsiveHelper_dt_basic.respond();
				}
			});
      var $contactForm = $("#order-form").validate({
        // Rules for form validation
        rules : {
          startdate : {
            required : true,
            minlength : 8
          }
        },

        // Messages for form validation
        messages : {
          startdate : {
            required : '날짜를 입력해 주세요(형식 : yyyymmdd) '
          }
        },



        // Do not change code below
        errorPlacement : function(error, element) {
          error.insertAfter(element.parent());
        }
      });
      var $e1csvForm = $("#e1csv-form").validate({
        // Rules for form validation
        rules : {
          stdate : {
            required : true,
            minlength : 8
          },
          eddate : {
            required : true,
            minlength : 8
          }
        },

        // Messages for form validation
        messages : {
          stdate : {
            required : '날짜를 입력해 주세요(형식 : yyyymmdd) '
          },
          eddate : {
            required : '날짜를 입력해 주세요(형식 : yyyymmdd) '
          }
        },



        // Do not change code below
        errorPlacement : function(error, element) {
          error.insertAfter(element.parent());
        }
      });
      // START AND FINISH DATE
      var minDate = new Date();
      var maxDate = new Date();
      var dd = maxDate.getDate() - 1;
      maxDate.setDate(dd);


      $('#startdate').datepicker({
        language : 'ko',
        dateFormat : 'yymmdd',
        setDate : new Date(),
        maxDate : maxDate,
        prevText : '<i class="fa fa-chevron-left"></i>',
        nextText : '<i class="fa fa-chevron-right"></i>'
      });
      $('#stdate').datepicker({
        language : 'ko',
        dateFormat : 'yymmdd',
        setDate : new Date(),
        maxDate : maxDate,
        prevText : '<i class="fa fa-chevron-left"></i>',
        nextText : '<i class="fa fa-chevron-right"></i>'
      });
      $('#eddate').datepicker({
        language : 'ko',
        dateFormat : 'yymmdd',
        setDate : new Date(),
        maxDate : maxDate,
        prevText : '<i class="fa fa-chevron-left"></i>',
        nextText : '<i class="fa fa-chevron-right"></i>'
      });

			/* chart colors default */
	    var $chrt_border_color = "#efefef";
	    var $chrt_grid_color = "#DDD"
	    var $chrt_main = "#E24913";      /* red       */
	    var $chrt_second = "#6595b4";    /* blue      */
	    var $chrt_third = "#FF9F01";    /* orange    */
	    var $chrt_fourth = "#7e9d3a";    /* green     */
	    var $chrt_fifth = "#BD362F";    /* dark red  */
	    var $chrt_mono = "#000";
	  	var day_data = [<?php echo $chart_data1; ?>];

			/* data stolen from http://howmanyleft.co.uk/vehicle/jaguar_'e'_type
	    $('ul.nav a').on('shown.bs.tab', function (e) {
	      var target = $(e.target).attr("href") // activated tab

	      switch (target) {
	        case "#s1":
	          charts1.redraw();
	          $(window).trigger('resize');
	          break;
	        case "#s2":
	          charts2.redraw();
	          $(window).trigger('resize');
	          break;
	        case "#s3":
	          charts3.redraw();
	          $(window).trigger('resize');
	          break;
	      }
	    }); */
	    var charts1 = Morris.Line({
	          element: 'year-graph',
	          data: day_data,
	          xkey: '날짜',
	          ykeys: ['교통량'],
	          labels: ['교통량'],
	          resize: true,
	          redraw: true,
	          postUnits:" 대",
	          lineColors:[$chrt_second]
	    });


	  //};


	  $('#gpdf').click(function () {
	      printMe();
	  });
	  // This will render SVG only as PDF and download
	  function printMe() {
	      xepOnline.Formatter.Format('year-graph', {render:'download', srctype:'svg'});

	  }



		/* END BASIC */

	};

	// load related plugins
	loadScript("js/plugin/datatables/jquery.dataTables.min.js", function(){
		loadScript("js/plugin/datatables/dataTables.colVis.min.js", function(){
			loadScript("js/plugin/datatables/dataTables.tableTools.min.js", function(){
				loadScript("js/plugin/datatables/dataTables.bootstrap.min.js", function(){
  				loadScript("js/plugin/jquery-form/jquery-form.min.js", function(){
 	  				loadScript("js/plugin/datatable-responsive/datatables.responsive.min.js", function(){
						  loadScript("js/plugin/morris/raphael.min.js", function(){
								loadScript("js/plugin/morris/morris.min.js", pagefunction)
							});
						});
  				});
				});
			});
		});
	});

</script>
