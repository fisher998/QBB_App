// 获取文件的扩展名
export function getFileExtension(filename) {
    const ext = filename.split('.').pop();
    return (ext === filename) ? '' : ext;
}