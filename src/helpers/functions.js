
/**
 * This function converts the data from a pd.DataFrame.to_json() format to the following form
 * [ { col:[values, ...]}, .... ] 
 * 
 * @param {*} backendData - parsed objects from pd.DataFrame.to_json()
 * @returns data - an array which is a collection of objects 
 * containing the column as keys and the rows as values
 */
export const convert_df_to_objects = (backendData) => {
  const columns = Object.keys(backendData);
  const rows = Object.keys(backendData[columns[0]]);
  let data = [];
  let colData = [];
  columns.forEach((col, colID) => {
    data.push({});
    rows.forEach((rowID) => {
      colData.push(backendData[col][rowID]);
    });
    data[colID][col] = colData;
    colData = [];
  });
  return data;
};