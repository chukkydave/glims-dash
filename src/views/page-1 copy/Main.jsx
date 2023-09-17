import {
  Lucide,
  Tippy,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownContent,
  DropdownItem,
  Litepicker,
  TinySlider,
} from "@/base-components";
import { faker as $f } from "@/utils";
import * as $_ from "lodash";
import classnames from "classnames";
import ReportLineChart from "@/components/report-line-chart/Main";
import ReportPieChart from "@/components/report-pie-chart/Main";
import ReportDonutChart from "@/components/report-donut-chart/Main";
import ReportDonutChart1 from "@/components/report-donut-chart-1/Main";
import SimpleLineChart1 from "@/components/simple-line-chart-1/Main";
import ReportMap from "@/components/report-map/Main";
import womanIllustrationUrl from "@/assets/images/woman-illustration.svg";
import phoneIllustrationUrl from "@/assets/images/phone-illustration.svg";
import { useRef, useState } from "react";

function Main() {
  const [salesReportFilter, setSalesReportFilter] = useState();
  const importantNotesRef = useRef();
  const prevImportantNotes = () => {
    importantNotesRef.current.tns.goTo("prev");
  };
  const nextImportantNotes = () => {
    importantNotesRef.current.tns.goTo("next");
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 2xl:col-span-9">
        <div className="grid grid-cols-12 gap-6">
          {/* BEGIN: Ads 1 */}
          <div className="col-span-12 lg:col-span-6 mt-6">
            <div className="box p-8 relative overflow-hidden bg-primary intro-y">
              <div className="leading-[2.15rem] w-full sm:w-72 text-white text-xl -mt-3">
                Welcome to Law-School Paddi (LSP)
              </div>
              <div className="w-full sm:w-72 leading-relaxed text-white/70 dark:text-slate-500 mt-3">
                This is the Admin section.
              </div>
              <button className="btn w-32 bg-white dark:bg-darkmode-800 dark:text-white mt-6 sm:mt-10">
                Start Now
              </button>
              <img
                className="hidden sm:block absolute top-0 right-0 w-2/5 -mt-3 mr-2"
                alt="Midone Tailwind HTML Admin Template"
                src={womanIllustrationUrl}
              />
            </div>
          </div>
          {/* END: Ads 1 */}

        </div>

      </div>
    </div>
  );
}

export default Main;
