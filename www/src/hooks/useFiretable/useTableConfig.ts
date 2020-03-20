import { useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import useDoc, { DocActions } from "../useDoc";
import { FieldType } from "constants/fields";
import _camelCase from "lodash/camelCase";
import _findIndex from "lodash/findIndex";
import { arrayMover } from "../../util/fns";
import { db, deleteField } from "../../firebase";

//import

const formatPathRegex = /\/[^\/]+\/([^\/]+)/g;

const formatPath = (tablePath: string) => {
  return `_FIRETABLE_/settings/schema/${tablePath.replace(
    formatPathRegex,
    "/subTables/$1"
  )}`;
};
const useTableConfig = (tablePath?: string) => {
  const [tableConfigState, documentDispatch] = useDoc({
    path: tablePath ? formatPath(tablePath) : "",
  });

  useEffect(() => {
    const { doc, columns } = tableConfigState;
    if (doc && columns !== doc.columns) {
      documentDispatch({ columns: doc.columns, rowHeight: doc.rowHeight });
    }
  }, [tableConfigState.doc]);
  /**  used for specifying the table in use
   *  @param table firestore collection path
   */
  const setTable = (table: string) => {
    documentDispatch({
      path: formatPath(table),
      columns: [],
      doc: null,
      ref: db.doc(formatPath(table)),
      loading: true,
    });
  };
  /**  used for creating a new column
   *  @param name of column.
   *  @param type of column
   *  @param data additional column properties
   */
  const add = (name: string, type: FieldType, data?: any) => {
    //TODO: validation
    const { columns } = tableConfigState;
    const newIndex = Object.keys(columns).length;
    let updatedColumns = columns;
    const key = _camelCase(name);
    updatedColumns[key] = { name, key, type, ...data, index: newIndex };
    documentDispatch({
      action: DocActions.update,
      data: { columns: updatedColumns },
    });
  };

  /**  used for updating the width of column
   *  @param index of column.
   *  @param width number of pixels, eg: 120
   */
  const [resize] = useDebouncedCallback((index: number, width: number) => {
    const { columns } = tableConfigState;
    columns[index].width = width;
    documentDispatch({ action: DocActions.update, data: { columns } });
  }, 1000);
  type updatable = { field: string; value: unknown };

  /**  used for updating column properties such as type,name etc.
   *  @param index of column.
   *  @param {updatable[]} updatables properties to be updated
   */
  const updateColumn = (key: string, updates: any) => {
    const { columns } = tableConfigState;

    const updatedColumns = {
      ...columns,
      [key]: { ...columns[key], ...updates },
    };

    documentDispatch({
      action: DocActions.update,
      data: { columns: updatedColumns },
    });
  };
  /** remove column by index
   *  @param index of column.
   */
  const remove = (key: string) => {
    const { columns } = tableConfigState;
    let updatedColumns = columns;
    updatedColumns[key] = deleteField();
    console.log({ updatedColumns });
    documentDispatch({
      action: DocActions.update,
      data: { columns: updatedColumns },
    });
  };
  /** reorder columns by key
   * @param draggedColumnKey column being repositioned.
   * @param droppedColumnKey column being .
   */
  const reorder = (draggedColumnKey: string, droppedColumnKey: string) => {
    const { columns } = tableConfigState;
    const draggedColumnIndex = _findIndex(columns, ["key", draggedColumnKey]);
    const droppedColumnIndex = _findIndex(columns, ["key", droppedColumnKey]);
    const reorderedColumns = [...columns];
    arrayMover(reorderedColumns, draggedColumnIndex, droppedColumnIndex);
    documentDispatch({
      action: DocActions.update,
      data: { columns: reorderedColumns },
    });
  };
  /** changing table configuration used for things such as row height
   * @param key name of parameter eg. rowHeight
   * @param value new value eg. 65
   */
  const updateConfig = (key: string, value: unknown) => {
    documentDispatch({
      action: DocActions.update,
      data: { [key]: value },
    });
  };
  const actions = {
    updateColumn,
    updateConfig,
    add,
    resize,
    setTable,
    remove,
    reorder,
  };
  return [tableConfigState, actions];
};

export default useTableConfig;
