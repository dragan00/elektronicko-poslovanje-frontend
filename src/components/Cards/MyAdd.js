import { Tooltip } from "antd";
import React from "react";
import { colors } from "../../styles/colors";

const MyAdd = ({ currentUserCompanyId, itemCompanyId }) => {
  return (
    <div>
      <Tooltip title="Oznaka za vlastiti oglas">
        <div
          style={{
            backgroundColor:
              currentUserCompanyId === itemCompanyId && colors.purple,
            position: "absolute",
            height: "100%",
            width: 3,
            left: 0,
            top: 0,
          }}
        />
      </Tooltip>
    </div>
  );
};

export default MyAdd;
