import React,{Component} from "react";

export default class BasicDatatable extends Component{
    render(){
        return(
            <section className="tile transparent">
                <div className="tile-header transparent">
                    <h1><strong>Basic</strong> Datatable </h1>
                    <span className="note">including: <span
                        className="italic">multi-column sorting and row select</span></span>
                    <div className="controls">
                        <a href="/#" className="minimize"><i className="fa fa-chevron-down"/></a>
                        <a href="/#" className="refresh"><i className="fa fa-refresh"/></a>
                        <a href="/#" className="remove"><i className="fa fa-times"/></a>
                    </div>
                </div>

                <div className="tile-body color transparent-black rounded-corners">
                    <div className="table-responsive">
                        <table className="table table-datatable table-custom" id="basicDataTable">
                            <thead>
                            <tr>
                                <th className="sort-alpha">Rendering engine</th>
                                <th className="sort-alpha">Browser</th>
                                <th className="sort-amount">Platform(s)</th>
                                <th className="sort-numeric">Engine version</th>
                                <th>CSS grade</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr className="odd gradeX">
                                <td>Trident</td>
                                <td>Internet
                                    Explorer 4.0
                                </td>
                                <td>Win 95+</td>
                                <td className="text-center"> 4</td>
                                <td className="text-center">X</td>
                            </tr>
                            <tr className="even gradeC">
                                <td>Trident</td>
                                <td>Internet
                                    Explorer 5.0
                                </td>
                                <td>Win 95+</td>
                                <td className="text-center">5</td>
                                <td className="text-center">C</td>
                            </tr>
                            <tr className="odd gradeA">
                                <td>Trident</td>
                                <td>Internet
                                    Explorer 5.5
                                </td>
                                <td>Win 95+</td>
                                <td className="text-center">5.5</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="even gradeA">
                                <td>Trident</td>
                                <td>Internet
                                    Explorer 6
                                </td>
                                <td>Win 98+</td>
                                <td className="text-center">6</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="odd gradeA">
                                <td>Trident</td>
                                <td>Internet Explorer 7</td>
                                <td>Win XP SP2+</td>
                                <td className="text-center">7</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="even gradeA">
                                <td>Trident</td>
                                <td>AOL browser (AOL desktop)</td>
                                <td>Win XP</td>
                                <td className="text-center">6</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Gecko</td>
                                <td>Firefox 1.0</td>
                                <td>Win 98+ / OSX.2+</td>
                                <td className="text-center">1.7</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Gecko</td>
                                <td>Firefox 1.5</td>
                                <td>Win 98+ / OSX.2+</td>
                                <td className="text-center">1.8</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Gecko</td>
                                <td>Firefox 2.0</td>
                                <td>Win 98+ / OSX.2+</td>
                                <td className="text-center">1.8</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Gecko</td>
                                <td>Firefox 3.0</td>
                                <td>Win 2k+ / OSX.3+</td>
                                <td className="text-center">1.9</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Gecko</td>
                                <td>Camino 1.0</td>
                                <td>OSX.2+</td>
                                <td className="text-center">1.8</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Gecko</td>
                                <td>Camino 1.5</td>
                                <td>OSX.3+</td>
                                <td className="text-center">1.8</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Gecko</td>
                                <td>Netscape 7.2</td>
                                <td>Win 95+ / Mac OS 8.6-9.2</td>
                                <td className="text-center">1.7</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Gecko</td>
                                <td>Netscape Browser 8</td>
                                <td>Win 98SE+</td>
                                <td className="text-center">1.7</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Gecko</td>
                                <td>Netscape Navigator 9</td>
                                <td>Win 98+ / OSX.2+</td>
                                <td className="text-center">1.8</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Gecko</td>
                                <td>Mozilla 1.0</td>
                                <td>Win 95+ / OSX.1+</td>
                                <td className="text-center">1</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Gecko</td>
                                <td>Mozilla 1.1</td>
                                <td>Win 95+ / OSX.1+</td>
                                <td className="text-center">1.1</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Gecko</td>
                                <td>Mozilla 1.2</td>
                                <td>Win 95+ / OSX.1+</td>
                                <td className="text-center">1.2</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Gecko</td>
                                <td>Mozilla 1.3</td>
                                <td>Win 95+ / OSX.1+</td>
                                <td className="text-center">1.3</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Gecko</td>
                                <td>Mozilla 1.4</td>
                                <td>Win 95+ / OSX.1+</td>
                                <td className="text-center">1.4</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Gecko</td>
                                <td>Mozilla 1.5</td>
                                <td>Win 95+ / OSX.1+</td>
                                <td className="text-center">1.5</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Gecko</td>
                                <td>Mozilla 1.6</td>
                                <td>Win 95+ / OSX.1+</td>
                                <td className="text-center">1.6</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Gecko</td>
                                <td>Mozilla 1.7</td>
                                <td>Win 98+ / OSX.1+</td>
                                <td className="text-center">1.7</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Gecko</td>
                                <td>Mozilla 1.8</td>
                                <td>Win 98+ / OSX.1+</td>
                                <td className="text-center">1.8</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Gecko</td>
                                <td>Seamonkey 1.1</td>
                                <td>Win 98+ / OSX.2+</td>
                                <td className="text-center">1.8</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Gecko</td>
                                <td>Epiphany 2.20</td>
                                <td>Gnome</td>
                                <td className="text-center">1.8</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Webkit</td>
                                <td>Safari 1.2</td>
                                <td>OSX.3</td>
                                <td className="text-center">125.5</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Webkit</td>
                                <td>Safari 1.3</td>
                                <td>OSX.3</td>
                                <td className="text-center">312.8</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Webkit</td>
                                <td>Safari 2.0</td>
                                <td>OSX.4+</td>
                                <td className="text-center">419.3</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Webkit</td>
                                <td>Safari 3.0</td>
                                <td>OSX.4+</td>
                                <td className="text-center">522.1</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Webkit</td>
                                <td>OmniWeb 5.5</td>
                                <td>OSX.4+</td>
                                <td className="text-center">420</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Webkit</td>
                                <td>iPod Touch / iPhone</td>
                                <td>iPod</td>
                                <td className="text-center">420.1</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Webkit</td>
                                <td>S60</td>
                                <td>S60</td>
                                <td className="text-center">413</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Presto</td>
                                <td>Opera 7.0</td>
                                <td>Win 95+ / OSX.1+</td>
                                <td className="text-center">-</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Presto</td>
                                <td>Opera 7.5</td>
                                <td>Win 95+ / OSX.2+</td>
                                <td className="text-center">-</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Presto</td>
                                <td>Opera 8.0</td>
                                <td>Win 95+ / OSX.2+</td>
                                <td className="text-center">-</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Presto</td>
                                <td>Opera 8.5</td>
                                <td>Win 95+ / OSX.2+</td>
                                <td className="text-center">-</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Presto</td>
                                <td>Opera 9.0</td>
                                <td>Win 95+ / OSX.3+</td>
                                <td className="text-center">-</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Presto</td>
                                <td>Opera 9.2</td>
                                <td>Win 88+ / OSX.3+</td>
                                <td className="text-center">-</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Presto</td>
                                <td>Opera 9.5</td>
                                <td>Win 88+ / OSX.3+</td>
                                <td className="text-center">-</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Presto</td>
                                <td>Opera for Wii</td>
                                <td>Wii</td>
                                <td className="text-center">-</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Presto</td>
                                <td>Nokia N800</td>
                                <td>N800</td>
                                <td className="text-center">-</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Presto</td>
                                <td>Nintendo DS browser</td>
                                <td>Nintendo DS</td>
                                <td className="text-center">8.5</td>
                                <td className="text-center">C/A<sup>1</sup></td>
                            </tr>
                            <tr className="gradeC">
                                <td>KHTML</td>
                                <td>Konqureror 3.1</td>
                                <td>KDE 3.1</td>
                                <td className="text-center">3.1</td>
                                <td className="text-center">C</td>
                            </tr>
                            <tr className="gradeA">
                                <td>KHTML</td>
                                <td>Konqureror 3.3</td>
                                <td>KDE 3.3</td>
                                <td className="text-center">3.3</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeA">
                                <td>KHTML</td>
                                <td>Konqureror 3.5</td>
                                <td>KDE 3.5</td>
                                <td className="text-center">3.5</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeX">
                                <td>Tasman</td>
                                <td>Internet Explorer 4.5</td>
                                <td>Mac OS 8-9</td>
                                <td className="text-center">-</td>
                                <td className="text-center">X</td>
                            </tr>
                            <tr className="gradeC">
                                <td>Tasman</td>
                                <td>Internet Explorer 5.1</td>
                                <td>Mac OS 7.6-9</td>
                                <td className="text-center">1</td>
                                <td className="text-center">C</td>
                            </tr>
                            <tr className="gradeC">
                                <td>Tasman</td>
                                <td>Internet Explorer 5.2</td>
                                <td>Mac OS 8-X</td>
                                <td className="text-center">1</td>
                                <td className="text-center">C</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Misc</td>
                                <td>NetFront 3.1</td>
                                <td>Embedded devices</td>
                                <td className="text-center">-</td>
                                <td className="text-center">C</td>
                            </tr>
                            <tr className="gradeA">
                                <td>Misc</td>
                                <td>NetFront 3.4</td>
                                <td>Embedded devices</td>
                                <td className="text-center">-</td>
                                <td className="text-center">A</td>
                            </tr>
                            <tr className="gradeX">
                                <td>Misc</td>
                                <td>Dillo 0.8</td>
                                <td>Embedded devices</td>
                                <td className="text-center">-</td>
                                <td className="text-center">X</td>
                            </tr>
                            <tr className="gradeX">
                                <td>Misc</td>
                                <td>Links</td>
                                <td>Text only</td>
                                <td className="text-center">-</td>
                                <td className="text-center">X</td>
                            </tr>
                            <tr className="gradeX">
                                <td>Misc</td>
                                <td>Lynx</td>
                                <td>Text only</td>
                                <td className="text-center">-</td>
                                <td className="text-center">X</td>
                            </tr>
                            <tr className="gradeC">
                                <td>Misc</td>
                                <td>IE Mobile</td>
                                <td>Windows Mobile 6</td>
                                <td className="text-center">-</td>
                                <td className="text-center">C</td>
                            </tr>
                            <tr className="gradeC">
                                <td>Misc</td>
                                <td>PSP browser</td>
                                <td>PSP</td>
                                <td className="text-center">-</td>
                                <td className="text-center">C</td>
                            </tr>
                            <tr className="gradeU">
                                <td>Other browsers</td>
                                <td>All others</td>
                                <td>-</td>
                                <td className="text-center">-</td>
                                <td className="text-center">U</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        )
    }
}
