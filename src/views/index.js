const axios = require("axios");
const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');

let isChecked = false;

function yourFunction(req, res) {
    isChecked = !isChecked;
    console.log("isChecked", isChecked);
    res.sendStatus(200);
}

router.get('/meos', async (req, res) => {
    fs.readFile(path.join(__dirname, "templates/meo.html"), 'utf-8', async (err, data) => {
        if (err) {
            return res.send("Load ui error");
        }

        let tableContent = ``;
        let meos;

        try {
            const response = await axios.get("http://localhost:3001/api/v1/meos");
            meos = response.data.data;
        } catch (error) {
            meos = [];
        }

        meos.map((meo, index)  => {
            tableContent += `
                <tr>
                    <th scope="row">${index + 1}</th>                 
                    <td>
                        <input type="checkbox" onclick="yourFunction()" ${isChecked ? "checked" : ""}>
                    </td>
                    <td id="row-${index}" class="${isChecked ? 'highlight' : ''} name-cell">
                        ${meo.name}
                    </td>
                    <td>
                        <button onclick="deleteMeo(${meo.id})" type="button" class="btn btn-primary">Delete</button>
                    </td>
                </tr>
            `;
        });

        const replacedData = data.replace("{{tableContent}}", tableContent);
        res.send(replacedData);
    });
});

router.get('/create-meo', (req, res) => {
    fs.readFile(path.join(__dirname, "templates/meoCreate.html"), 'utf-8', async (err, data) => {
        if (err) {
            return res.send("Load ui error");
        }
        res.send(data);
    });
});

router.delete('/meos/:id', (req, res) => {
    const meoId = req.params.id;
    // Xử lý logic xóa `meo` với ID tương ứng ở đây
    console.log("Deleting meo with ID:", meoId);
    res.sendStatus(200);
});

module.exports = router;
