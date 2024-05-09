import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Orders from "../components/Order";
function Managent() {
const invoices  = useSelector((state) => state.invoices);
console.log(invoices)
 

  return (
    <div className="container">
      <div className="content">
        <div class="projects-section">
          <Orders orders={invoices} />
        </div>
      </div>
    </div>
  );
}

export default Managent;
