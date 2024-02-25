$(document).ready(function() {
    $('#formulario-busqueda').on('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe automáticamente

        // Oculta la sección de contenido mientras no encuentre el superhero
        $('#contenido').hide();

        const superheroName = $('#busqueda').val();
        const url = 'https://www.superheroapi.com/api/7168580893228090/';
        const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const apiUrl = `${url}${superheroName}`;

        $.ajax({
            type: "GET",
            url: corsProxyUrl + apiUrl,
            dataType: "json",
            success: function(data) {
                if (data.response === "success") {
                    $('header, #buscar, footer').hide();
                    $('#contenido').html(generateHeroHTML(data)); 
                    // Muestra la sección de contenido después de obtener la respuesta exitosa
                    $('#contenido').show();
                    $('#chartContainer').show();
        
                    // Datos para el gráfico
                    var chartData = [
                        { y: parseInt(data.powerstats.intelligence), label: "Intelligence" },
                        { y: parseInt(data.powerstats.strength), label: "Strength" },
                        { y: parseInt(data.powerstats.speed), label: "Speed" },
                        { y: parseInt(data.powerstats.durability), label: "Durability" },
                        { y: parseInt(data.powerstats.power), label: "Power" },
                        { y: parseInt(data.powerstats.combat), label: "Combat" }
                    ];
        
                    // Configuración y renderizado del gráfico
                    var chart = new CanvasJS.Chart("chartContainer", {
                        theme: "light2",
                        exportEnabled: true,
                        animationEnabled: true,
                        title: {
                            text: `Estadisticas de Poder para ${data.name}`
                        },
                        data: [{
                            type: "pie",
                            startAngle: 25,
                            toolTipContent: "<b>{label}</b>: {y}",
                            showInLegend: "true",
                            legendText: "{label}",
                            indexLabelFontSize: 16,
                            indexLabel: "{label} - {y}",
                            dataPoints: chartData
                        }]
                    });
                    chart.render();
                } else {
                    // Si no se encuentra un superhéroe, muestra un mensaje de error
                    $('#contenido').html('<p>Superhéroe no encontrado.</p>');
                    // Muestra la sección de contenido con el mensaje de error
                    $('#contenido').show();
                }
            },
            error: function(error) {
                console.log(error);
                alert('Ocurrió un error al buscar el superhéroe.');
            }
        });
    });
});


function generateHeroHTML(data) {
    return `
        <h1 class="text-center">SuperHero Encontrado</h1>
        <div class="card">
            <div class="card-body">
                <div class="row align-items-start">
                    <div class="col-md-4">
                        <img src="${data.image.url}" alt="${data.name}" class="img-hero align-top w-100">
                    </div>
                    <div class="col-md-8">
                        <div class="info-section">
                            <p>Nombre: ${data.name}</p>
                            <p>Nombre Completo: ${data.biography['full-name']}</p>
                            <p>Conexiones: ${data.connections['group-affiliation']}</p>
                            <p>Publicado por: ${data.biography['publisher']}</p>
                            <p>Ocupación: ${data.work.occupation}</p>
                            <p>Primera aparición: ${data.biography['first-appearance']}</p>
                            <p>Altura: ${data.appearance['height'][0]} - ${data.appearance['height'][1]}</p>
                            <p>Peso: ${data.appearance['weight'][0]} - ${data.appearance['weight'][1]}</p> 
                            <p>Alianzas: ${data.biography['aliases']}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}