"use client";

import PropTypes from "prop-types";
import {cn} from "@/src/utils/helper/cn";

const DefaultLayout = ({className, decoration = <></>, children, ...props}) => {
  return (
    <section
      className={cn(
        `font-geologica-medium relative mx-auto flex w-full flex-col items-center gap-4 px-4 py-10 sm:px-8 xl:px-30 xl:py-20 2xl:px-60`,
        className
      )}
      {...props}
    >
      {decoration}
      <div className="relative w-full max-w-[1440px]">{children}</div>
    </section>
  );
};

DefaultLayout.propTypes = {
  className: PropTypes.string,
  decoration: PropTypes.node,
  children: PropTypes.node.isRequired
};

export default DefaultLayout;
