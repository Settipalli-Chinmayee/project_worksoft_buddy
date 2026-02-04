import React, { useContext } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; //this is important to render
import { ThemeContext } from "../ThemeContext/ThemeContext";

const TableSkeleton = () => {
  const {isTheme} = useContext(ThemeContext)
  return (
    <SkeletonTheme
      baseColor={isTheme ? "#4b556380" : "#e0e0e0"}
      highlightColor={isTheme ? "#6b7280" : "#f5f5f5"}
    >
      <div style={{ padding: "8px" }}>
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            style={{ display: "flex", justifyContent:"center", alignContent: "center", alignItems: "center",  gap: "10px", marginBottom: "10px" }}
          >
            <Skeleton height={10} width={20} borderRadius={25} />
            <Skeleton height={15} width={60} borderRadius={25} />
            {/* <Skeleton height={15} width={120} borderRadius={25}/> */}
            {/* <Skeleton height={10} width={180} borderRadius={25}/>
            <Skeleton height={10} width={100} borderRadius={25}/>
            <Skeleton height={10} width={100} borderRadius={25}/>
            <Skeleton height={10} width={120} borderRadius={25}/> */}
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
};

export default TableSkeleton;
