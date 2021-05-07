class dateUtils {
  static inputDateFormat(data) {
    if (data == null) return null;
    return `${data.getFullYear()}-${(data.getMonth() + 1).toString().padStart(2, '0')}-${data.getDate().toString().padStart(2, '0')}`;
  }

  static viewDateFormat(data) {
    if (data == null) return null;
    return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
  }
}

export default dateUtils;
