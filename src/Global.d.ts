declare module "*.module.scss";
declare module "*.module.css";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg" {
    import React from 'react';
    const SVG: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export default SVG
}