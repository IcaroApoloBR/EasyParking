(function () {
    const $ = q => document.querySelector(q);


    function convertPeriod(mil) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);

        return `${min}m e ${sec}s`;
    }

    function renderGarage () {
        const garage = getGarage();
        $("#garage").innerHTML = "";
        garage.forEach(c => addCarToGarage(c))
    }
    
    function addCarToGarage (car) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${car.name}</td>
            <td>${car.color}</td>
            <td>${car.license}</td>
            <td data-time="${car.time}">${new Date(car.time)
                        .toLocaleString("pt-BR", {
                            hour: "numeric", minute: "numeric"
                        })}</td>
            <td>
                <button class="delete">x</button>
            </td>
        `;

        $("#garage").appendChild(row);
    };

    function checkOut(info) {
        let period = new Date() - new Date(info[3].dataset.time);
        period = convertPeriod(period);

        const license = info[2].textContent;
        const msg = `O veículo ${info[0].textContent} de placa ${license} permaneceu estacionado por ${period}.
        Deseja encerrar ?`;

        if(!confirm(msg)) return;

        const garage = getGarage().filter(c => c.license !== license);
        localStorage.garage = JSON.stringify(garage);

        renderGarage();
    }

    const getGarage = () => localStorage.garage ? JSON.parse(localStorage.garage) : [];

    renderGarage();
    $("#submit").addEventListener("click", e => {
        const name = $("#name").value
        const color = $("#color").value
        const license = $("#license").value;

        if(!name || !color || !license) {
            alert("Os campos são obrigatórios!");
            return;
        }

        const car = { name, color, license, time: new Date() }

        const garage = getGarage();
        garage.push(car);

        localStorage.garage = JSON.stringify(garage);

        addCarToGarage(car);

        $("#name").value = "";
        $("#color").value = "";
        $("#license").value = "";
    });

    $("#garage").addEventListener("click", e => {
        if(e.target.className == "delete")
            checkOut(e.target.parentElement.parentElement.cells);
    });
})();