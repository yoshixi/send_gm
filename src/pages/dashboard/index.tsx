import type { NextPage } from "next";
import type { ReactElement } from "react";

const Index: NextPage = () => {
  return (
    <div>
      <p>aa</p>
    </div>
  );
};

Index.getLayout = function getLayout(page: ReactElement) {
  return (
    <div>
      <p>layout</p>
      <div>{page}</div>
    </div>
  );
};

export default Index;
