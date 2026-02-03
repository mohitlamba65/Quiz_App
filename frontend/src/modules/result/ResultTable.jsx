
import React from "react";

export const ResultTable = ({ userData }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-gray-700 text-white rounded-lg">
        <thead className="bg-gray-900 text-gray-300 text-center">
          <tr>
            <th className="border-2 p-2 sm:p-4">User</th>
            <th className="border-2 p-2 sm:p-4">Attempts</th>
            <th className="border-2 p-2 sm:p-4">Points Scored</th>
            <th className="border-2 p-2 sm:p-4">Quiz Status</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 text-center">
          <tr>
            <td className="border-2 p-2 sm:p-4">
              {userData.username || "N/A"}
            </td>
            <td className="border-2 p-2 sm:p-4">
              {userData.attempts || "N/A"}
            </td>
            <td className="border-2 p-2 sm:p-4">{userData.score || "N/A"}</td>
            <td className="border-2 p-2 sm:p-4">{userData.status || "N/A"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
