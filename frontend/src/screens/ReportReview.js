import React, { useRef, useEffect, useState } from "react";
import generatePDF from 'react-to-pdf';
import PDFExportPage from "../components/PDFExportPage";


const ReportReview = ({ onClose, order }) => {

  const targetRef = useRef();

  return (
    <div className="report">
      <div className="report-content">
      <button onClick={() => generatePDF(targetRef, {filename: 'page.pdf'})}>Download PDF</button>
         <div ref={targetRef}>
         <PDFExportPage order={order} />
         </div>
        
      </div>
    </div>
  );
};

export default ReportReview;
