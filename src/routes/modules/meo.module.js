import express from 'express';
const router = express.Router();
import fs from 'fs';
import path from 'path';
import multiparty from 'multiparty';

router.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, "meo.json"), 'utf-8', (err, data) => {
        if(err) {
            return res.status(500).json({
                message: "Lấy meos thất bại!"
            })
        }
        return  res.status(200).json({
            message: "Lấy meos thành công!",
            data: JSON.parse(data)
        })
    })
})

router.delete('/:meoId', (req, res) => {
    if (req.params.meoId) {
        fs.readFile(path.join(__dirname, "meo.json"), 'utf-8', (err, data) => {
            if(err) {
                return res.status(500).json({
                    message: "Lấy meos thất bại!"
                })
            }
            let meos = JSON.parse(data);
            let meoDelete = meos.find(meo => meo.id == req.params.meoId);
            meos = meos.filter(meo => meo.id != req.params.meoId);

            fs.writeFile(path.join(__dirname, "meo.json"),JSON.stringify(meos), (err) => {
                if(err) {
                    return res.status(500).json({
                        message: "Lưu file thất bại!"
                    })
                }
                return res.status(200).send("ok")
            })
        })
    }else {
        return res.status(500).json(
            {
                message: "Vui lòng truyền meoId!"
            }
        )
    }
})

router.post('/', (req,res) => {
    //import multiparty from 'multiparty';
    let form = new multiparty.Form();

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).send("Lỗi đọc form!")
        }

        // let fileName = "meo_" + Date.now();
        // let fileTail = "." + files.avatar[0].originalFilename.split('.')[files.avatar[0].originalFilename.split('.').length - 1];
        // let fileNameSave = fileName + fileTail;

        // fs.copyFile(files.avatar[0].path, path.join(__dirname, "../../../public/meo-images/" + fileNameSave), (err) => {
        //     if(err) {
        //         console.log("err", err)
        //         return res.status(500).json({
        //             message: "Lưu file thất bại!"
        //         })
        //     }

            let newMeo = {
                id: Date.now(),
                name: fields.name[0],
                // weight: fields.weight[0],
                // avatar: fileNameSave
            }

            fs.readFile(path.join(__dirname, "meo.json"), 'utf-8' ,(err, data) => {
                if(err) {
                    return res.status(500).json(
                        {
                            message: "Đọc dữ liệu thất bại!"
                        }
                    )
                }
                let oldData = JSON.parse(data);
                oldData.unshift(newMeo)
                fs.writeFile(path.join(__dirname, "meo.json"), JSON.stringify(oldData), (err) => {
                    if(err) {
                        return res.status(500).json(
                            {
                                message: "Ghi file thất bại!"
                            }
                        )
                    }
                    return res.redirect('/meos')
                })
            })
        })
    })
// })

module.exports = router;